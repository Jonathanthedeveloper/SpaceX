const form = document.getElementById("form")
form.addEventListener("submit", function (event) {
    const {plan , amount} = Object.fromEntries([...new FormData(this)])
    if (!plan || !amount) {
        return event.preventDefault()
    }
    if (plan === "starter" && (amount < 500 || amount >= 5000) ){
        alert("Invalid Amount")
        event.preventDefault()
    } else if(plan === "regular" && (amount < 5000 || amount >=10000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }else if(plan === "pro" && (amount < 10000 || amount >=50000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }else if(plan === "elite" && (amount < 50000 || amount > 250000 ) ){
        alert("Invalid Amount")
        event.preventDefault()
    }
})