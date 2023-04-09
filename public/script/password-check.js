let btn = document.getElementById('submit-btn');
btn.addEventListener('mouseenter', function(){
    let password1 = document.getElementById('password1').value;
    let password2 = document.getElementById('password2').value;
    console.log(password1);
    console.log(password2);
    if(password1 != password2){
        alert('Password Mismatch');
    }
});