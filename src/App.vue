<template>
  <div id="app">
    <header class="app-header">
      <div class="logo-container">
        <!-- <img alt="arXiv 로고" src="./assets/arxiv-logo.png" class="logo" v-if="false"> -->
        <h1 class="app-title">arXiv 딥 러닝 논문 컬렉터</h1>
      </div>
      <p class="app-description">
        최근 일주일 내에 출간된 딥 러닝 관련 논문을 수집하고 표시합니다.
      </p>
    </header>

    <main class="app-content">
      <PaperList />
    </main>

    <footer class="app-footer">
      <p>
        &copy; {{ new Date().getFullYear() }} arXiv 딥 러닝 논문 컬렉터. arXiv
        API를 활용하여 만들어졌습니다.
      </p>
    </footer>
  </div>
</template>

<script>
import PaperList from "./components/PaperList.vue";

export default {
  name: "App",
  components: {
    PaperList,
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: "Noto Sans KR", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f7f9fc;
  color: #2c3e50;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #3498db;
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.logo {
  max-width: 200px;
  margin-bottom: 1rem;
}

.app-title {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
}

.app-description {
  font-size: 1.2rem;
  margin: 0.5rem 0 0;
  opacity: 0.9;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.app-content {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
}

/* 글로벌 스타일 */
a {
  color: #3498db;
}

a:hover {
  color: #2980b9;
}

@media (max-width: 768px) {
  .app-title {
    font-size: 2rem;
  }

  .app-description {
    font-size: 1rem;
  }
}
</style>
