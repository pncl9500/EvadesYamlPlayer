function YAMLfromStrs(strs){
  //strs is an array containing each line of the yaml file
  //dont ask because i don't know either
  yaml = "";
  for (var i = 0; i < strs.length; i++){
    yaml += strs[i];
    if (strs !== strs.length - 1){
      yaml += "\n";
    }
  }
  return yaml;
}


//called in preload
function loadAllYAML(){
  loadedYAMLstrs = {};
  regionPathsToLoad = getRptl();
  for (const [key, value] of Object.entries(regionPathsToLoad)){
    loadedYAMLstrs[key] = loadStrings(value);
  }
}

function regionFromName(name){
  return regionFromYAML(YAMLfromStrs(loadedYAMLstrs[name]));
}

function regionFromYAML(regionData){
  json = YAML.parse(regionData);
  //now the YAML is in json and we are happy
  region = new Region(json.name, json.properties, json.areas);
  return region;
}

