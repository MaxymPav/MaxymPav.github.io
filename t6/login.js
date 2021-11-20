function login(){
    const email = document.getElementById('email');
    const password = document.getElementById('pass');

    db.collection('users')
    .where("email", "==", email.value)
    .get()
    .then( (res) => {
        res.forEach( doc => {
            let user ={
                id: doc.id, 
                ...doc.data()
            }
            console.log(user.password)
            console.log(password.value)
            if(user.password == password.value) {
                localStorage.setItem("user", JSON.stringify(user));
                window.location.href = "index.html";
            } else {
                alert("Wrong password!");
            }
            console.log(user)
        })
    });
}
function checkUser(){
    const user = localStorage.getItem("user");
    if (user != null || user != ""){
        window.location.href = "index.html";
    }
    box.classlist.add('box');
    box.classList.add('d-flex');
    box.id = id;

    boxImage.classList.add('box-image');

    boxTitle.classList.add('box-title');

    boxTitle.innerText = title;

    box.appendChild(boxImage);
    box.appendChild(boxTitle);

    document.getElementById('articles-box').appendChild(box);
}