loadedAssets = [];

function loadImg(img, imgcode){
  return loadImage(img, () => {loadedAssets.push(imgcode)});
}

function drawImage(imgCode, x, y, radius){
  if (loadedAssets.includes(imgCode)){
    image(im[imgCode], x - radius, y - radius, radius * 2, radius * 2);
  } else {
    noStroke();
    fill(60);
    //why????
    rect(x, y, radius * 2, radius * 2);
  }
}

function drawImageRect(imgCode, x, y, w, h){
  if (loadedAssets.includes(imgCode)){
    image(im[imgCode], x - w / 2, y - w / 2, w, h);
  } else {
    noStroke();
    fill(60);
    rect(x, y, w, h);
  }
}

function drawImageUnscaled(imgCode, x, y, w){
  if (loadedAssets.includes(imgCode)){
    let width = w * 2;
    let height = width * (im[imgCode].height / im[imgCode].width);
    image(im[imgCode], x - width / 2, y - height / 2, width, height);
  } else {
    noStroke();
    fill(60);
    rect(x, y, width, width);
  }
}

function loadAssets(){
  im = {
    "missingImage": loadImg("imageAssets/missingImage.png", "missingImage"),

    "ent.pumpkin_off": loadImg("imageAssets/ent/pumpkin_off.png", "ent.pumpkin_off"),
    "ent.pumpkin_on": loadImg("imageAssets/ent/pumpkin_on.png", "ent.pumpkin_on"),

    "ent.flashlight_item": loadImg("imageAssets/ent/flashlight_item.png", "ent.flashlight_item"),

    
    "ab.flow": loadImg("imageAssets/ab/flow.png", "ab.flow"),
    "ab.harden": loadImg("imageAssets/ab/harden.png", "ab.harden"),

    "ent.torch-1": loadImg("imageAssets/ent/torch-1.png", "ent.torch-1"),
    "ent.torch-2": loadImg("imageAssets/ent/torch-2.png", "ent.torch-2"),
    "ent.torch-3": loadImg("imageAssets/ent/torch-3.png", "ent.torch-3"),
    "ent.torch-4": loadImg("imageAssets/ent/torch-4.png", "ent.torch-4"),
    "ent.torch-5": loadImg("imageAssets/ent/torch-5.png", "ent.torch-5"),
    "ent.torch-6": loadImg("imageAssets/ent/torch-6.png", "ent.torch-6"),

    "ab.warp": loadImg("imageAssets/ab/warp.png", "ab.warp"),
    "ab.paralysis": loadImg("imageAssets/ab/paralysis.png", "ab.paralysis"),

    "ab.reverse": loadImg("imageAssets/ab/reverse.png", "ab.reverse"),
    "ab.minimize": loadImg("imageAssets/ab/minimize.png", "ab.minimize"),

    "ab.distort": loadImg("imageAssets/ab/distort.png", "ab.distort"),
    "ab.energize": loadImg("imageAssets/ab/energize.png", "ab.energize"),

    "ab.resurrection": loadImg("imageAssets/ab/resurrection.png", "ab.resurrection"),
    "ab.reanimate": loadImg("imageAssets/ab/reanimate.png", "ab.reanimate"),

    "ab.stomp": loadImg("imageAssets/ab/stomp.png", "ab.stomp"),
    "ab.vigor": loadImg("imageAssets/ab/vigor.png", "ab.vigor"),

    "ab.barrier": loadImg("imageAssets/ab/barrier.png", "ab.barrier"),
    "ab.stream": loadImg("imageAssets/ab/stream.png", "ab.stream"),

    "ab.night": loadImg("imageAssets/ab/night.png", "ab.night"),
    "ab.vengeance": loadImg("imageAssets/ab/vengeance.png", "ab.vengeance"),
    "pr.vengeance_projectile": loadImg("imageAssets/ent/vengeance_projectile.png", "pr.vengeance_projectile"),

    "ab.black_hole": loadImg("imageAssets/ab/black_hole.png", "ab.black_hole"),
    "ab.orbit": loadImg("imageAssets/ab/orbit.png", "ab.orbit"),

    "ab.rewind": loadImg("imageAssets/ab/rewind.png", "ab.rewind"),
    "ab.backtrack": loadImg("imageAssets/ab/backtrack.png", "ab.backtrack"),

    "ab.atonement": loadImg("imageAssets/ab/atonement.png", "ab.atonement"),
    "ab.depart": loadImg("imageAssets/ab/depart.png", "ab.depart"),

    "ab.bandages": loadImg("imageAssets/ab/bandages.png", "ab.bandages"),
    "ab.latch": loadImg("imageAssets/ab/latch.png", "ab.latch"),

    "ab.spark": loadImg("imageAssets/ab/spark.png", "ab.spark"),
    "ab.lightning": loadImg("imageAssets/ab/lightning.png", "ab.lightning"),
    "ab.charge": loadImg("imageAssets/ab/charge.png", "ab.charge"),

    "ab.magnetism_down": loadImg("imageAssets/ab/magnetism_down.png", "ab.magnetism_down"),
    "ab.magnetism_up": loadImg("imageAssets/ab/magnetism_up.png", "ab.magnetism_up"),

    "ab.shriek": loadImg("imageAssets/ab/shriek.png", "ab.shriek"),
    "ab.shadow": loadImg("imageAssets/ab/shadow.png", "ab.shadow"),

    "ab.decay": loadImg("imageAssets/ab/decay.png", "ab.decay"),
    "ab.shatter": loadImg("imageAssets/ab/shatter.png", "ab.shatter"),

    "ab.sweet_tooth": loadImg("imageAssets/ab/sweet_tooth.png", "ab.sweet_tooth"),
    "ab.sugar_rush": loadImg("imageAssets/ab/sugar_rush.png", "ab.sugar_rush"),
    "pr.sweet_tooth_item": loadImg("imageAssets/ent/sweet_tooth_item.png", "pr.sweet_tooth_item"),
    
    "ab.shift": loadImg("imageAssets/ab/shift.png", "ab.shift"),
    "ab.obscure": loadImg("imageAssets/ab/obscure.png", "ab.obscure"),

    "ab.crumble": loadImg("imageAssets/ab/crumble.png", "ab.crumble"),
    "ab.earthquake": loadImg("imageAssets/ab/earthquake.png", "ab.earthquake"),

    "ab.radioactive_gloop": loadImg("imageAssets/ab/radioactive_gloop.png", "ab.radioactive_gloop"),
    "ab.sticky_coat": loadImg("imageAssets/ab/sticky_coat.png", "ab.sticky_coat"),

    "ab.masonry": loadImg("imageAssets/ab/masonry.png", "ab.masonry"),
    "ab.tether": loadImg("imageAssets/ab/tether.png", "ab.tether"),

    "ab.burrow": loadImg("imageAssets/ab/burrow.png", "ab.burrow"),
    "ab.pit": loadImg("imageAssets/ab/pit.png", "ab.pit"),

    "ab.parasitize": loadImg("imageAssets/ab/parasitize.png", "ab.parasitize"),
    "ab.expel": loadImg("imageAssets/ab/expel.png", "ab.expel"),

    "ab.eclipse": loadImg("imageAssets/ab/eclipse.png", "ab.eclipse"),
    "ab.remain": loadImg("imageAssets/ab/remain.png", "ab.remain"),

    "ab.astralprojection": loadImg("imageAssets/ab/astralprojection.png", "ab.astralprojection"),
    "ab.shackle": loadImg("imageAssets/ab/shackle.png", "ab.shackle"),

    "ab.impulse": loadImg("imageAssets/ab/impulse.png", "ab.impulse"),
    "ab.misery": loadImg("imageAssets/ab/misery.png", "ab.misery"),

    "ab.stick": loadImg("imageAssets/ab/stick.png", "ab.stick"),
    "ab.spill": loadImg("imageAssets/ab/spill.png", "ab.spill"),

    "ab.lantern": loadImg("imageAssets/ab/lantern.png", "ab.lantern"),
    "ab.flashlight": loadImg("imageAssets/ab/flashlight.png", "ab.flashlight"),
  }
}

function loadFonts(){
  fnt = {
    tahomaBold: loadFont("fontAssets/tahomabd.ttf")
  }
}