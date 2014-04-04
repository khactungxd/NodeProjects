exports.showListJS = function(req, res){
	res.render('listJS', { title: 'List JS - SequelizeJS Example' });
};

exports.showAutoComplete = function(req, res){
	res.render('autoComplete', { title: 'jQuery AutoComplete Example' });
};