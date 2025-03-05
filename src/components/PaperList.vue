<template>
  <div class="paper-container">
    <h1 class="main-title">최근 딥 러닝 관련 논문</h1>

    <div v-if="loading" class="loader-container">
      <div class="loader"></div>
      <p>논문을 불러오는 중입니다...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <h3>오류가 발생했습니다</h3>
      <p>{{ error }}</p>
      <button @click="fetchPapers" class="retry-button">다시 시도</button>
    </div>

    <div v-else-if="papers.length === 0" class="no-papers">
      <p>최근 발행된 논문이 없습니다.</p>
    </div>

    <div v-else class="papers-list">
      <div v-for="paper in papers" :key="paper.id" class="paper-card">
        <h2 class="paper-title">
          <a :href="paper.link" target="_blank" rel="noopener noreferrer">{{
            paper.title
          }}</a>
        </h2>

        <div class="paper-meta">
          <div class="paper-authors">
            <strong>저자:</strong> {{ paper.authors.join(", ") }}
          </div>

          <div class="paper-date">
            <strong>출간일:</strong> {{ formatDate(paper.published) }}
          </div>

          <div class="paper-categories">
            <strong>주요 카테고리:</strong>
            {{ paper.primaryCategory || paper.categories[0] }}
          </div>

          <div v-if="paper.comment" class="paper-comment">
            <strong>코멘트:</strong> {{ paper.comment }}
          </div>
        </div>

        <div class="paper-summary">
          <strong>초록:</strong>
          <p>{{ paper.summary }}</p>
        </div>

        <div class="paper-actions">
          <a
            :href="paper.link"
            target="_blank"
            rel="noopener noreferrer"
            class="paper-link"
          >
            논문 보기
          </a>
          <a
            v-if="paper.pdfLink"
            :href="paper.pdfLink"
            target="_blank"
            rel="noopener noreferrer"
            class="paper-link pdf-link"
          >
            PDF 다운로드
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import arxivService from "@/services/arxivService";

export default {
  name: "PaperList",
  data() {
    return {
      papers: [],
      loading: false,
      error: null,
    };
  },
  created() {
    this.fetchPapers();
  },
  methods: {
    async fetchPapers() {
      this.loading = true;
      this.error = null;

      try {
        this.papers = await arxivService.getRecentPapers();
      } catch (error) {
        this.error =
          "논문을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
        console.error("논문 로딩 오류:", error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";

      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      return date.toLocaleDateString("ko-KR", options);
    },
  },
};
</script>

<style scoped>
.paper-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.main-title {
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  border-bottom: 2px solid #3498db;
  padding-bottom: 1rem;
}

.papers-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.paper-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.paper-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.paper-title {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.paper-title a {
  color: #3498db;
  text-decoration: none;
  transition: color 0.2s;
}

.paper-title a:hover {
  color: #2980b9;
  text-decoration: underline;
}

.paper-meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.paper-authors,
.paper-date,
.paper-categories,
.paper-comment {
  color: #555;
}

.paper-summary {
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: #333;
}

.paper-summary p {
  margin-top: 0.5rem;
  text-align: justify;
}

.paper-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.paper-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.pdf-link {
  background-color: #e74c3c;
}

.paper-link:hover {
  background-color: #2980b9;
}

.pdf-link:hover {
  background-color: #c0392b;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  padding: 2rem;
  background-color: #ffebee;
  border-radius: 10px;
  color: #c62828;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2980b9;
}

.no-papers {
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 10px;
  color: #333;
}

@media (min-width: 768px) {
  .paper-meta {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 992px) {
  .paper-meta {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
