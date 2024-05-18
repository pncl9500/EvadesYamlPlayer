function getPlayerSelectorMenu(){
  list = [
    btn("Go back", 38, 12, () => {queueCheatMenuChange(baseCheatMenuItems)}, "Return to the previous menu."),
    txt("Player List", 20), bigLine(),
  ];
  for (let i in game.players){
    let nb = btn(game.players[i].name, 180, 12, () => {
      queueCheatMenuChange(getPlayerEditMenu(game.players[i]));
    })
    try {
      nb.color = game.players[i].color;
      nb.hoverColor.r = nb.color.r + 40;
      nb.hoverColor.g = nb.color.g + 40;
      nb.hoverColor.b = nb.color.b + 40;
      if (nb.color.r + nb.color.g + nb.color.b < 216){
        nb.textColor.r = 255;
        nb.textColor.g = 255;
        nb.textColor.b = 255;
      }
    } catch (error) {
      //do nothing
    }
    list.push(nb);
  }
  return list;
}

function getPlayerEditMenu(player){
  var editedPlayer = player;
  let pname = editedPlayer.name;
  list = [
    btn("Go back", 38, 12, () => {queueCheatMenuChange(getPlayerSelectorMenu())}, "Return to the previous menu."),
    txt("Editing " + pname, 20), bigLine(),
    row([txt("Player management:", 12), 
        btn("Set as main", null, 12, () => {let oldSets = game.mainPlayer.ctrlSets; game.mainPlayer.ctrlSets = [], game.setMainPlayer(editedPlayer), editedPlayer.ctrlSets = oldSets}, "Make " + pname + " the main player, letting you control it."),
        btn("Set as main (ignore controls)", null, 12, () => {game.setMainPlayer(editedPlayer);}, "Make " + pname + " the main player without changing any controls."),
        btn("Delete player", null, 12, () => {game.cycleMainPlayer(), editedPlayer.removeSelf();if (game.players.length === 0){queueCheatMenuChange(getPlayerlessCheatMenuItems())} else {queueCheatMenuChange(getPlayerSelectorMenu())}}, "Delete " + pname + "."),
        btn("Clear other players", null, 12, () => {clearDummyPlayers(editedPlayer)}, "Delete all players except for " + pname + "."),]),
    row([txt("Change hero: ", 12), 
        btn("Open list", 37, 12, () => {queueCheatMenuChange(getHeroSelectorMenu(editedPlayer, getPlayerSelectorMenu))}, "Select a hero for " + pname + " to be."),]), 
    txt("Control sets", 16), bigLine(),
    row([txt("Controlled by WASD:", 12), 
        tog(11, 11, false, () => {
          for (let i in editedPlayer.ctrlSets){
            if (editedPlayer.ctrlSets[i].constructor.name === "WASDset"){
              return;
            }
          }
          editedPlayer.ctrlSets.push(new WASDset());
        }, () => {
          for (let i = 0; i < editedPlayer.ctrlSets.length; i++){
            if (editedPlayer.ctrlSets[i].constructor.name === "WASDset"){
              editedPlayer.ctrlSets.splice(i, 1);
              i--;
            }
          }
        }, () => {
          for (let i in editedPlayer.ctrlSets){
            if (editedPlayer.ctrlSets[i].constructor.name === "WASDset"){
              return true;
            }
          }
          return false;
        }, "Control " + pname + " with WASD for movement and JKL for abilities."),]),
    row([txt("Controlled by arrows:", 12), 
        tog(11, 11, false, () => {
          for (let i in editedPlayer.ctrlSets){
            if (editedPlayer.ctrlSets[i].constructor.name === "ArrowSet"){
              return;
            }
          }
          editedPlayer.ctrlSets.push(new ArrowSet());
        }, () => {
          for (let i = 0; i < editedPlayer.ctrlSets.length; i++){
            if (editedPlayer.ctrlSets[i].constructor.name === "ArrowSet"){
              editedPlayer.ctrlSets.splice(i, 1);
              i--;
            }
          }
        }, () => {
          for (let i in editedPlayer.ctrlSets){
            if (editedPlayer.ctrlSets[i].constructor.name === "ArrowSet"){
              return true;
            }
          }
          return false;
        }, "Control " + pname + " with the arrow keys for movement and ZXC for abilities."),]),
      row([txt("Controlled by mouse:", 12), 
        tog(11, 11, false, () => {
          for (let i in editedPlayer.ctrlSets){
            if (editedPlayer.ctrlSets[i].constructor.name === "MouseSet"){
              return;
            }
          }
          editedPlayer.ctrlSets.push(new MouseSet());
        }, () => {
          for (let i = 0; i < editedPlayer.ctrlSets.length; i++){
            if (editedPlayer.ctrlSets[i].constructor.name === "MouseSet"){
              editedPlayer.ctrlSets.splice(i, 1);
              i--;
            }
          }
        }, () => {
          for (let i in editedPlayer.ctrlSets){
            if (editedPlayer.ctrlSets[i].constructor.name === "MouseSet"){
              return true;
            }
          }
          return false;
        }, "Control " + pname + " with the mouse for movement and ZXC for abilities."),]),
      txt("Macros", 16), bigLine(),
      txt("Using macros to activate abilities with no cooldown may result in flashing light effects.", 8),
      row([txt("Ability 1 macro:", 12), 
        tog(11, 11, false, () => {editedPlayer.ab1macro = true}, () => {editedPlayer.ab1macro = false}, () => {return editedPlayer.ab1macro}, "Make " + pname + " use ability 1 when possible."),]),
      row([txt("Ability 2 macro:", 12), 
        tog(11, 11, false, () => {editedPlayer.ab2macro = true}, () => {editedPlayer.ab2macro = false}, () => {return editedPlayer.ab2macro}, "Make " + pname + " use ability 2 when possible."),]),
      row([txt("Ability 3 macro:", 12), 
        tog(11, 11, false, () => {editedPlayer.ab3macro = true}, () => {editedPlayer.ab3macro = false}, () => {return editedPlayer.ab3macro}, "Make " + pname + " use ability 3 when possible."),]),
  ];
  return list;
}