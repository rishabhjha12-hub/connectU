module.exports.home=function(req,res){
    // return res.end('<h1>express is running for connectRJ</h1>')
    return res.render('home',{
        title:'home'
    });
}
// module.exports.about=function(req,res){
//     return res.end('<h1>about</h1>')
// }