document.addEventListener('DOMContentLoaded', async function(){
    let text = await axios.get("templates/test.html");
    const data = {
        message: "Hello vue.js",
        products: [ 
            {
                name: "Футболки",
                url: "https://talant.shop/static/items/2019/November/5dbc31ea8c52ab6209a6d122-medium.jpg",
                count: 1,
                color: "#fff",
                price: 20,
                preOrder: false,
                delivery: false,
                totalPrice: 20
            },
            {
                name: "Footbolka",
                url: "https://talant.shop/static/items/2019/November/5dbc31ea8c52ab6209a6d122-medium.jpg",
                count: 1,
                color: "#fff",
                price: 20,
                preOrder: false,
                delivery: false,
                totalPrice: 20
            } 
        ]
    }
    const CardTemplate = {
        props: ['product'],
        template: text.data,
        methods:{
            countTotalPrice(){
                const allPrice = this.product.count * this.product.price;
                let preOrder = 0;
                let delivery = 0;
                if(this.product.preOrder){
                    preOrder = allPrice - (allPrice*(1/20))
                }

                if(this.product.delivery){
                    delivery = allPrice + allPrice/10;
                }

                this.product.totalPrice = allPrice
            }
        }
    }
    const app = {
        data() { return data },
        components: {
            'card': CardTemplate 
        },
        methods: { }
}
    Vue.createApp(app).mount('#app')
})   