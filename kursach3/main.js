document.addEventListener('DOMContentLoaded', async function(){   

    //витягуємо темплейти
    let home             = await axios.get("templates/home.html");
    let login            = await axios.get("templates/login.html");
    let addProduct       = await axios.get("templates/addProduct.html");
    let allProducts      = await axios.get("templates/allProducts.html");
    let productCard      = await axios.get("templates/productCard.html");
    let orderProducts    = await axios.get("templates/orderProducts.html");
    let cart             = await axios.get("templates/cart.html");
    let orderProductCard = await axios.get("templates/orderProductCard.html");

    //Основна інформація для spa (сайту)
    const data =  {
        message: 'Hello Vue.js!',
        currentPath: window.location.hash,
        user: {},
        signIn: false,
        logged: false,
        admin: false,
        newProductImage: "",
        products: [],
        edit_product: {},
        cart: [],
        orderedProducts: [],
        newOrder: { order: {}, user: {} }
    };

    //Компоненти
    const Home = {
        template: home.data,
    };

    const Login = {
        template: login.data,
        props: ['signIn'],
        methods: {
            googleAuth(){
                firebase.auth()
                .signInWithPopup(provider)
                .then( result => {
                    console.log(result)
                    const user = result.user;

                    const new_user = {
                        displayName: user.displayName,
                        email: user.email,
                        photo: user.photoURL
                    };
                    data.user = new_user;
                    data.logged = true;
                    this.$root.$forceUpdate();
                    window.location.hash = "/home";
                    
                    localStorage.setItem("user", JSON.stringify(new_user));

                    this.checkAdmin(user.email);
                    console.log(new_user);
                })
                .catch( error => {
                    console.log(error)
                });
            },
            signUpWithPassword(){
                console.log('signUpWithPassword');
                const email = document.getElementById("user-email").value;
                const password = document.getElementById("user-password").value;
                console.log(email);
                console.log(password);

                firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    var user = userCredential.user;

                    const new_user = {
                        displayName: user.displayName,
                        email: user.email,
                        photo: user.photoURL
                    };
                    data.user = new_user;
                    data.logged = true;
                    this.$root.$forceUpdate();
                    window.location.hash = "/home";
                    localStorage.setItem("user", new_user);
                    this.checkAdmin(user.email);
                    console.log(new_user);
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode);
                    console.log(errorMessage);
                });
            },
            signInWithPassword(){
                const email = document.getElementById("user-email").value;
                const password = document.getElementById("user-password").value;
                console.log(email);
                console.log(password);

                firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    var user = userCredential.user;

                    const new_user = {
                        displayName: user.displayName,
                        email: user.email,
                        photo: user.photoURL
                    };
                    data.user = new_user;
                    data.logged = true;
                    this.$root.$forceUpdate();
                    window.location.hash = "/home";
                    
                    localStorage.setItem("user", new_user);
                    
                    this.checkAdmin(user.email);
                    console.log(new_user);
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode);
                    console.log(errorMessage);
                });
            },
            checkAdmin(email){
                db.collection("admins")
                .get()
                .then( res => {
                    const adminEmails = [];
                    res.forEach( e => adminEmails.push(e.data().email) );
                    console.log(adminEmails);
                    console.log('includes', adminEmails.includes(email))
                    console.log(email)
                    if(adminEmails.includes(email)){
                        data.admin = true;
                        localStorage.setItem("admin", true)
                        this.$root.$forceUpdate();
                        console.log("Welcome Admin!!!");
                    }
                    else if(data.admin == true){
                        data.admin = false;
                        localStorage.setItem("admin", false)
                        this.$root.$forceUpdate();
                    }
                    else {
                        data.admin = false;
                        localStorage.setItem("admin", false)
                        this.$root.$forceUpdate();
                    }
                })
                console.log("Check for admin!", email)
            }
        }
    };

    const AddProduct = {
        template: addProduct.data,
        props: ['newProduct'],
        methods: {
            addProductToDB(){
                const newProduct = {
                    name: document.getElementById('product_name').value,
                    url: document.getElementById('product_img').value,
                    price: document.getElementById('product_price').value
                }

                db.collection("products")
                .add(newProduct)
                .then(() => console.log('product added to db'))
            }
        } 
    }

    const ProductCard = {
        name: "product-card",
        template: productCard.data,
        props: ['product'],
        methods: {
            deleteProduct(id){
                db.collection("products")
                .doc(id)
                .delete()
                .then( () => {
                    data.edit_product = data.products.filter( e => e.id != id );
                    this.$parent.getAllProducts();
                });
            },
            editProduct(id){
                data.edit_product = data.products.filter( e => e.id == id )[0];
                this.$parent.$forceUpdate();
            }
        }
    }

    const AllProducts = {
        template: allProducts.data,
        methods: {
            getAllProducts(){
                db.collection("products")
                .get()
                .then( res => {
                    data.products = [];
                    res.forEach( element => {
                        const product = {
                            ...element.data(),
                            id: element.id
                        };
                        data.products.push(product)
                    })
                    this.$forceUpdate();
                })
            },
            saveEditedProduct(){
                db.collection("products")
                .doc(data.edit_product.id)
                .update(data.edit_product)
                .then( () => {
                    // дії після оновлення
                    console.log("Document is updated!")
                    this.getAllProducts();
                });
            }
        },
        components: {
            ProductCard
        },
        mounted: function(){
            this.getAllProducts();
        }
    }

    const OrderProductCard = {
        name: "order-product-card",
        template: orderProductCard.data,
        props: ['product'],
        methods: {
            addToCart(id){
                if(!data.cart.includes(id)){
                    data.cart.push(id);
                    localStorage.setItem("cart", JSON.stringify(data.cart))
                    console.log(data.cart)
                }
                data.products.forEach( product => {
                    if(product.id == id){ 
                        product.inCart = true; 
                    };
                })
                this.$root.$forceUpdate();
                this.$forceUpdate();
            }
        }
    }

    const OrderProducts = {
        template: orderProducts.data,
        methods: {
            getAllProducts(){
                db.collection("products")
                .get()
                .then( res => {
                    data.products = [];
                    res.forEach( element => {
                        const product = {
                            ...element.data(),
                            id: element.id
                        };
                        if(data.cart.includes(product.id)){
                            product.inCart = true;
                        }
                        data.products.push(product);
                    })
                    this.$forceUpdate();
                })
            }
        },
        components: {
            OrderProductCard
        },
        mounted: function(){
            this.getAllProducts();
        }
    }

    const Cart = {
        template: cart.data,
        methods: {
            getProductsFromCart(){
                data.orderedProducts = [];
                data.cart = JSON.parse(localStorage.getItem("cart")) || [];
                this.$forceUpdate();
                if(data.cart.length < 1) return;
                db.collection("products")
                .where(firebase.firestore.FieldPath.documentId(), "in", data.cart)
                .get()
                .then( res => {
                    res.forEach(e => {
                        const product = {
                            id: e.id,
                            count: 1,
                            ...e.data()
                        };
                        data.orderedProducts.push(product);
                    })
                    this.countOrderPrice();
                    this.$forceUpdate();
                })
            },
            removeProductFromCart(id){
                data.cart = data.cart.filter(prod_id => prod_id != id);
                data.orderedProducts = data.orderedProducts.filter(prod => prod.id != id);
                localStorage.setItem("cart", JSON.stringify(data.cart));
                this.countOrderPrice();
                this.$forceUpdate();
                this.$root.$forceUpdate();
            },
            countOrderPrice(){
                console.log(data.orderedProducts);
                let orderSum = 0;
                data.orderedProducts.forEach(p => {
                    orderSum += Number(p.price.replace(/\s/g, ''))*p.count;
                })
                data.newOrder = {
                    order: {
                        sum: orderSum,
                        products: data.orderedProducts
                    },
                    user: data.user
                }
                const date = new Date();
                console.log(date.getDate())
            }
        },
        components: {
        },
        mounted: function(){
            this.getProductsFromCart();
        }
    }

    //Роути (які копоненти відображати)
    const routes = {
        '/': Home,
        '/home': Home,
        '/login': Login,
        '/addproduct': AddProduct,
        '/allproducts': AllProducts,
        '/products': OrderProducts,
        '/cart': Cart,
    }

    const app = {
        data() { return data },
        methods: {
            logOut(){
                firebase.auth().signOut().then(() => {
                    data.logged = false;
                    data.admin = false;
                    localStorage.removeItem("user");
                    localStorage.removeItem("admin");
                    data.user = {};
                    this.$forceUpdate();
                    window.location.hash = "/login";
                }).catch((error) => {
                    console.log(error)
                });
            },
            checkUser(){
                data.user = JSON.parse(localStorage.getItem("user")) || {};
                data.admin = JSON.parse(localStorage.getItem("admin")) || false;
                data.cart = JSON.parse(localStorage.getItem("cart")) || [];
                if(data.user.email != null){
                    data.logged = true;
                }
                this.$forceUpdate();
            }
        },
        components: { },
        computed: {
            currentView() {
                return routes[this.currentPath.slice(1) || '/'] || NotFound
            }
        },
        mounted() {
            window.addEventListener('hashchange', () => {
                this.currentPath = window.location.hash
            });
            this.checkUser();
        }
    }
    Vue.createApp(app).mount('#app');
})