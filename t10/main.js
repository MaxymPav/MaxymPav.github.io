const App = {
    data() {
      return {
        counter: 0,
        title: "Test title",
        show: false,
        showTest: true,
        balance: 0,
        showButton: true,
        courses: [
            {title: "2015 year", value: "15"},
            {title: "2018 year", value: "21"},
            {title: "2022 year", value: "31"},
        ]
      }
    },
    mounted() {
        setInterval(() => {
          this.counter++
          this.showButton = true;5
          if(this.counter >=3){
                this.show = true;
            }
        }, 1000)
        this.title= "Сторінка завантажена";
        },
        methods: {
            getBitcoin(){
                alert(
                `
                Виведено ${this.counter} bitcoins!
                На рахунку ${this.balance} bitcoins!
                `);
                this.balance = this.balance + this.counter;
                this.counter = 0
        }
    }
}
Vue.createApp(App).mount('#app')