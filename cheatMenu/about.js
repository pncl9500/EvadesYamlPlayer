function getAboutMenu(){
  list = [  
    txt("About", 20), bigLine(),
    txt("EvadesYamlPlayer is an Evades.io sandbox with a focus on simulating multiplayer", 12),
    txt("interactions in a singleplayer environment.", 12),
    pdd(20, 10),
    txt("Please note that EvadesYamlPlayer is currently nowhere near a finished or stable state.", 12),
    txt("Updates are pushed without thorough testing and crashes may occur.", 12),
    pdd(20, 10),
    txt("In the event of a crash, switch to Firefox if you aren't using it already, since", 12),
    txt("EvadesYamlPlayer is inexplicably more stable on Firefox than on Chrome. Don't ask", 12),
    txt("because I don't know why either.", 12),
    pdd(20, 10),
    txt("If you are taking code from EvadesYamlPlayer for your own projects (which you are freely allowed to do), please keep in mind that", 8),
    txt("it is very likely for the code to not be accurate to vanilla Evades.io. Most behavior was either taken directly from other Evades.io", 8),
    txt("sandboxes or determined through potentially faulty empirical in-game observations, and is most likely not entirely game-accurate.", 8),
    pdd(10, 5),
    txt("Another note: the region files for Cyber Castle, Cyber Castle Hard, and Research Lab have been slightly altered to be compatible", 8),
    txt("with EvadesYamlPlayer, so please try to acquire these map files from other sources if possible.", 8),


    
  ]
  return list;
}