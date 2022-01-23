const express = require('express')
const app = express()

let bal =0,bug=0,exp =0;
let arr = []
global.showLowBalancePrompt=""
global.EditKey = ""
const bodyParser = require('body-parser')
const { urlencoded} = require('body-parser')
const {redirect} = require('express/lib/response');
const req = require('express/lib/request');
app.use(bodyParser.json())
app.use(urlencoded({
    extended: true
}))
app.listen(3002,()=>{
    console.log("server is listening at 3002")
})
app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('index', {bal,bug,exp,arr })
})
app.get(('/delete/:val'),(req,res)=>{
    showLowBalancePrompt="";
    // console.log(req.params.val.trim())
    const k = req.params.val.trim()
    bal+=~~arr[k].value
    exp-=~~arr[k].value
    arr.splice(k,1)
    res.redirect('/')

})
app.get(('/show/:val'),(req,res)=>{
    const key = req.params.val.trim();
    global.EditKey = key;
    // console.log("in show ", key);
    res.redirect("/");
})
app.get(('/edit/:title/:amount'),(req,res)=>{
    let title = req.params.title.trim();
    let amount = ~~req.params.amount.trim();
    if (title == null || amount == null ) 
    {
        res.redirect("/");
        global.EditKey = "";
        return;
    }

    bal +=~~arr[global.EditKey].value;
    exp-=~~arr[global.EditKey].value;

    arr[global.EditKey].value = amount;
    arr[global.EditKey].expenseTitle = title;

    exp+=~~amount;
    bal = ~~bug- ~~exp;
    global.EditKey = "";
    res.redirect("/");
    
})

app.post('/expense/add', async (req, res) => {
    // console.log(req.body.expenseTitle)
    // console.log(req.body.value)
    exp=0
    arr.forEach((a)=>{
        exp+=~~a.value
    })
    exp+=~~req.body.value
        
    if(bal-exp>=0 || bal>=req.body.value )
    {
        showLowBalancePrompt="";
        bal = ~~bug- ~~exp
        // console.log('bal'+bal)
        // console.log('exp'+exp)
       // console.log('expense added')
        
        res.redirect('/')
        let obj = {expenseTitle:req.body.expenseTitle,value:req.body.value}
        arr.push(obj)
    }
    else{ 
        exp-=~~req.body.value
        // console.log('not enough bal')
        showLowBalancePrompt="low";
        res.redirect('/')


    }
})
app.post('/budget/calculate', async (req, res) => {
    // console.log(req.body.budget)
    if(~~bug>0)
    {
        bug += ~~req.body.budget
        bal += ~~req.body.budget
    }
    else
    {
        bug = ~~req.body.budget
        bal = ~~bug 
    }
    // console.log('budget calculated')
    res.redirect('/')    
})

app.use((req,res)=>{
    res.render('404')
})