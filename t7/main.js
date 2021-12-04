class Phone{
    constructor(name, company, operatingSystem, screen, price, battery, color){
        this.name = name;
        this.company = company;
        this.operatingSystem = operatingSystem;
        this.screen = screen;
        this.price = price;
        this.battery = battery;
        this.color = color
    }

    getInfo(){
        return `${this.name} from ${this.company}, ${this.color}`;
    }

    ChargeTime(){
        const minutes = Math.floor(this.battery / 38);
        if(minutes < 60){
            return `${Math.floor(minutes)} minutes`;
        }
        if(minutes >= 60){
            const hours = Math.floor(minutes / 60);
            const min_left = minutes - (hours*60);
            return `${hours} hours and ${min_left} minutes`
        }
    }
}

let phones = JSON.parse( localStorage.getItem("phones") ) || [];
phones = phones.map(e => new Phone(
    e.name,
    e.company,
    e.operatingSystem,
    e.screen,
    e.price,
    e.battery,
    e.color
))

console.log(phones);
console.log(phones[0]);
console.log(phones[0].getInfo());


function addNewPhones(){
    const new_phone = new Phone(
        document.getElementById('name').value,
        document.getElementById('company').value,
        document.getElementById('operatingSystem').value,
        document.getElementById('screen').value,
        document.getElementById('price').value,
        document.getElementById('battery').value,
        document.getElementById('color').value
    );
    phones.push(new_phone);
    localStorage.setItem('phones', JSON.stringify(phones));
}
