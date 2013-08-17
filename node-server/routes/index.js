/**
 * Get title for app
 *
 * @param {Object} req
 * @param {Object} res
 */

exports.index = function(req, res){
  res.render('index', { title: 'Test task' });
};

exports.about = function(req, res){
  res.render('about', { title: 'Test task About' });
};

exports.work = function(req, res){
  res.render('work', { title: 'Test task Work' });
};

exports.store = function(req, res){
  res.render('store', { title: 'Test task Store' });
};