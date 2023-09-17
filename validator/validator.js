

const isValidPassword = (pw) => {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/.test(pw))
        return true
}

const isValidEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        return true
}

const isValidUserName=(pass)=>{
    if(/^[a-zA-Z\-]+$/.test(pass))
    return true
}

module.exports={isValidPassword,isValidEmail,isValidUserName}