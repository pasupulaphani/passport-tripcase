/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};
  profile.displayName = json.user_settings.first_name;
  profile.username = json.user_settings.primary_email;
  profile.emails = [{ value: json.user_settings.email }];

  return profile;
};
