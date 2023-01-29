import pagination from "./pagination.js"; // 匯入pagination模組(使用模組一定要記得在script裡加入type="module"否則無法使用)
let productModal = ""; // 也可以換成let productModal={}
let delProductModal = "";
const app = Vue.createApp({
  data() {
    return {
      apiPath: "zxcv123",
      products: [],
      tempProduct: {
        imagesUrl: [],
      },

      //   確認是新增或是編輯所使用的
      isNew: false,

      // 做分頁使用
      page: {},
    };
  },
  methods: {
    checkAdmin() {
      axios
        .post(`https://vue3-course-api.hexschool.io/v2/api/user/check`)
        .then(() => {
          this.getData();
        })
        .catch(() => {
          window.location = "index.html";
        });
    },
    getData(page = 1) {
      //page=1設定參數預設值，如果沒有設定參數預設值的話page會是undefined
      axios
        .get(
          `https://vue3-course-api.hexschool.io/v2/api/${this.apiPath}/admin/products?page=${page}`
        )
        .then((response) => {
          this.products = response.data.products;

          // 將分頁功能儲存
          this.page = response.data.pagination;
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    openModal(status, product) {
      if (status === "createNew") {
        // 打開新增modal
        productModal.show();
        this.isNew = true;

        // 如果是新增產品會帶入初始資料
        this.tempProduct = {
          imagesUrl: [],
        };
      } else if (status === "edit") {
        // 打開編輯modal
        productModal.show();
        this.isNew = false;

        // 如果是編輯產品會帶入當前要編輯的資料
        this.tempProduct = { ...product };
      } else if (status === "delete") {
        // 打開刪除modal
        delProductModal.show();
        this.tempProduct = { ...product }; // 取id使用
      }
    },
    updateProduct() {
      let method = "post";
      let url = `https://vue3-course-api.hexschool.io/v2/api/${this.apiPath}/admin/product`;
      if (!this.isNew) {
        url = `https://vue3-course-api.hexschool.io/v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        method = "put";
      }
      axios[method](url, { data: this.tempProduct })
        .then((response) => {
          alert(response.data.message);
          this.getData();

          //   關閉modal
          productModal.hide();
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    deleteProduct() {
      axios
        .delete(
          `https://vue3-course-api.hexschool.io/v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
        )
        .then((response) => {
          alert(response.data.message);
          this.getData();
          delProductModal.hide();
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
  },

  // 區域註冊元件(分頁元件)
  components: {
    pagination,
  },
  mounted() {
    // 取出 token
    const cookieValue = document.cookie.replace(
      /(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    // 每次都會帶入
    axios.defaults.headers.common["Authorization"] = cookieValue;
    this.checkAdmin();

    // 將bootstrap新增、編輯的modal實體化
    productModal = new bootstrap.Modal(document.querySelector("#productModal"));

    // 將bootstrap刪除的modal實體化
    delProductModal = new bootstrap.Modal(
      document.querySelector("#delProductModal")
    );
  },
});

// 使用全域註冊元件，product-modal為自訂名稱，將x-template的id名稱#product-modal-template放進template
app.component("product-modal", {
  props: ["tempProduct", "updateProduct"],
  template: "#product-modal-template",
});

// 將delProductModal註冊全域元件
app.component("delete-modal", {
  props: ["tempProduct", "deleteProduct"],
  template: "#delete-modal-template",
});

app.mount("#app");
