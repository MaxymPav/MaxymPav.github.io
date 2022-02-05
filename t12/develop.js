const products = [
    {
        id: 0,
        name: "Google Pixel 4 XL 64GB Black",
        url: "https://content1.rozetka.com.ua/goods/images/big/24330840.jpg",
        display: "6.3",
        camera: "8 Мп",
        acc: "3700",
        price: "14 290"
    },
    {
        id: 0,
        name: "Google Pixel 4 XL 64GB Black",
        url: "https://content1.rozetka.com.ua/goods/images/big/24330840.jpg",
        display: "6.3",
        camera: "8 Мп",
        acc: "3700",
        price: "14 290"
    }
];
function addProductsToDB(products){
    products.forEach(element => {
        db.collection('products')
        .add(element)
        .then(res => console.log('success'))
    });
}
addProductsToDB(products);