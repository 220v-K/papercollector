import axios from "axios";
import { XMLParser } from "fast-xml-parser";

/**
 * arXiv API 서비스
 * arXiv에서 최근 딥 러닝 관련 논문을 가져옵니다.
 */
const arxivService = {
  /**
   * 최근 일주일 내 발행된 딥 러닝 관련 논문을 검색합니다.
   * @param {number} maxResults 최대 결과 수 (기본값: 50)
   * @returns {Promise} 논문 정보 배열
   */
  async getRecentPapers(maxResults = 50) {
    try {
      // 현재 날짜로부터 7일 전 날짜 계산
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      // 검색 쿼리 생성 - arXiv API에 맞게 수정
      // arXiv API는 실제로 submittedDate 검색을 지원하지 않으므로, 대신 최근 결과를 가져와서 날짜를 기준으로 필터링
      const query = encodeURIComponent(
        `cat:cs.AI OR cat:cs.LG OR cat:cs.CV OR cat:cs.CL OR cat:stat.ML` +
          ` AND (all:deep learning OR all:neural network OR all:machine learning)`
      );

      // arXiv API 엔드포인트
      const apiUrl = `http://export.arxiv.org/api/query?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=${maxResults}`;

      console.log("API 요청: ", apiUrl);
      const response = await axios.get(apiUrl);

      // XML 응답을 파싱
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "_",
      });
      const result = parser.parse(response.data);

      // 응답에서 entry 배열 추출
      const entries = result.feed.entry || [];
      const entryArray = Array.isArray(entries) ? entries : [entries];

      // 최근 7일 내 논문 필터링 및 정보 추출
      const papers = entryArray
        .filter((entry) => {
          const published = new Date(entry.published);
          return published >= sevenDaysAgo;
        })
        .map((entry) => {
          // 저자 정보 처리 (단일 저자 또는 저자 배열)
          let authors = [];
          if (entry.author) {
            if (Array.isArray(entry.author)) {
              authors = entry.author.map((author) => author.name);
            } else {
              authors = [entry.author.name];
            }
          }

          // 카테고리 정보 처리 (단일 카테고리 또는 카테고리 배열)
          let categories = [];
          if (entry.category) {
            if (Array.isArray(entry.category)) {
              categories = entry.category.map((cat) => cat._term);
            } else {
              categories = [entry.category._term];
            }
          }

          // 링크 정보 처리 (PDF 또는 기본 링크)
          let mainLink = "";
          let pdfLink = "";

          if (Array.isArray(entry.link)) {
            const links = entry.link;
            mainLink =
              links.find((link) => link._rel === "alternate")._href || "";
            pdfLink = links.find((link) => link._title === "pdf")._href || "";
          } else if (entry.link) {
            mainLink = entry.link._href || "";
          }

          // 논문 정보 객체 구성
          return {
            id: entry.id || "",
            title: entry.title ? entry.title.replace(/\s+/g, " ").trim() : "",
            authors: authors,
            summary: entry.summary
              ? entry.summary.replace(/\s+/g, " ").trim()
              : "",
            published: entry.published || "",
            updated: entry.updated || "",
            link: mainLink,
            pdfLink: pdfLink,
            comment: entry["arxiv:comment"] || "",
            categories: categories,
            primaryCategory: entry["arxiv:primary_category"]
              ? entry["arxiv:primary_category"]._term
              : "",
          };
        });

      console.log(`총 ${papers.length}개의 논문을 가져왔습니다.`);
      return papers;
    } catch (error) {
      console.error("arXiv API 요청 중 오류 발생:", error);
      throw error;
    }
  },
};

export default arxivService;
