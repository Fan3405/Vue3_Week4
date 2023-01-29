export default {
  // 用props把外層page資料傳進來，pages、getData可自訂名稱，但html不能使用大寫所以要寫成get-data
  props: ["pages", "getData"],

  // 將bootstrap分頁的版型貼在template裡
  // 用v-for="page in pages.total_pages"跑迴圈判斷有幾頁
  // :class="{active:page === pages.current_page}"判斷當前頁面並套用active效果將當前頁數按鈕呈現藍色
  // :class="{disabled:!pages.has_pre}"、:class="{disabled:!pages.has_next}"判斷有無前一頁或下一頁，沒有就套用disabled效果不能再點擊按鈕
  // @click.prevent="getData(page)"點擊頁數按鈕切換資料並取消預設回到最上方功能、也可使用emit寫法@click.prevent="$emit('change-page', page)"，'change-page'是自訂名稱page是要傳入的參數
  // @click="getData(pages.current_page-1)、@click="getData(pages.current_page+1)點擊按鈕取得前一頁、下一頁資料
  template: `<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item" :class="{disabled:!pages.has_pre}">
      <a class="page-link" href="#" aria-label="Previous" @click="getData(pages.current_page-1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>

    <li class="page-item" :class="{active:page === pages.current_page}" v-for="page in pages.total_pages" :key=" page + 'pages' ">
        <a class="page-link" href="#" @click.prevent="getData(page)">{{page}}</a>
    </li>
    
    <li class="page-item" :class="{disabled:!pages.has_next}">
      <a class="page-link" href="#" aria-label="Next" @click="getData(pages.current_page+1)">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>`,
};
