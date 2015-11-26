// Sandstorm context is detected using the METEOR_SETTINGS environment variable
// in the package definition.
const isSandstorm = Meteor.settings && Meteor.settings.public &&
                    Meteor.settings.public.sandstorm;

function gameMode(test) {
  console.log("game_mode:" + Meteor.settings.public.game_mode);
  console.log("test:" + test);
  console.log("equal? ");
  var areEqual = Meteor.settings.public.game_mode === test;
  console.log(areEqual);
  if (!isSandstorm) {
    throw new Meteor.Error("function gameMode() is specific to Sandstorm \
      but this app is currently not running in Sandstorm");
  } else {
    return areEqual;
  }
}
Blaze.registerHelper('isSandstorm', isSandstorm);
Blaze.registerHelper('sandstormGameMode', gameMode);
