class Order{
    constructor(product_name, product_price, user_email, count = 1, delivery, submitted = false, save = false){


        this.product_name  = product_name;
        this.product_price = product_price;
        this.user_email    = user_email;
        this.count         = count;
        this.delivery      = delivery;
        this.submitted     = submitted

        this.total          = this.getTotalPrice();
        this.delivery_price = this.getDeliveryPrice();

        if(save){
            this.saveOrder()
        }
    }

    getDeliveryPrice(){
        switch(this.delivery){
            case "Новапошта":
                return 60;
            case "Укр пошта":
                return 50;
            case "Кур'єр":
                return 70;
            default:
                return 60;
        }
    }

    getTotalPrice(){
        return this.product_price*this.count + this.getDeliveryPrice();
    }

    saveOrder(){
        let new_order = {
            product_name:   this.product_name,
            product_price:  this.product_price,
            user_email:     this.user_email,
            count:          this.count,
            delivery:       this.delivery,
            submitted:      this.submitted,
            total:          this.total,
            delivery_price: this.delivery_price,
        }
        db.collection("orders").add(new_order).then( () => alert("Order added!"));
    }
}

function makeOrder(){
    const order = new Order(
        document.getElementById("product_name").value,
        document.getElementById("product_price").value,
        document.getElementById("user_email").value,
        document.getElementById("count").value,
        document.getElementById("delivery").value,
        false,
        true
    );

    console.log(order);
    console.log(order.getDeliveryPrice());
    console.log(order.getTotalPrice());
}

class Admin{
    static test ="TEST!!!!!";
    static sayHello(){
        console.log("Hello");
    }

    static approveOrder(id){
        db.colleection("orders").doc(id).update({
            submitted: false
        })
    }
    static deleteOrder(id){
        db.colleection("orders").doc(id).delete().then(
            () => alert("Order deleted!")
        )
    }
}

//Admin.approveOrder(".....");

function getOrders(){
    db.collection("orders").get().then(
        res => {
            res.forEach(element => {
                console.log(element.id, element.data());
            });
        }
    )
}
getOrders();

Admin.sayHello();

console.log( Admin.test )