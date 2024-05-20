loadedAssets = [];

function loadImg(img){
  return loadImage(img, loadedAssets.push(img));
}

function drawImage(imgCode, x, y, radius){
  if (loadedAssets.includes(imgCode)){
    image(im[imgCode], x - radius, y - radius, radius * 2, radius * 2);
  } else {
    noStroke();
    fill(255);
    rect(x - radius, y - radius, radius * 2, radius * 2);
  }
}

function loadAssets(){
  im = {
    "missingImage": loadImg("imageAssets/missingImage.png"),
    "ab.flow": loadImg("imageAssets/ab/flow.png"),
    "ab.harden": loadImg("imageAssets/ab/harden.png"),

    "ab.warp": loadImg("imageAssets/ab/warp.png"),
    "ab.paralysis": loadImg("imageAssets/ab/paralysis.png"),

    "ab.reverse": loadImg("imageAssets/ab/reverse.png"),
    "ab.minimize": loadImg("imageAssets/ab/minimize.png"),

    "ab.distort": loadImg("imageAssets/ab/distort.png"),
    "ab.energize": loadImg("imageAssets/ab/energize.png"),

    "ab.resurrection": loadImg("imageAssets/ab/resurrection.png"),
    "ab.reanimate": loadImg("imageAssets/ab/reanimate.png"),

    "ab.stomp": loadImg("imageAssets/ab/stomp.png"),
    "ab.vigor": loadImg("imageAssets/ab/vigor.png"),

    "ab.barrier": loadImg("imageAssets/ab/barrier.png"),
    "ab.stream": loadImg("imageAssets/ab/stream.png"),

    "ab.night": loadImg("imageAssets/ab/night.png"),
    "ab.vengeance": loadImg("imageAssets/ab/vengeance.png"),
    "pr.vengeance_projectile": loadImg("imageAssets/ent/vengeance_projectile.png"),

    "ab.black_hole": loadImg("imageAssets/ab/black_hole.png"),
    "ab.orbit": loadImg("imageAssets/ab/orbit.png"),

    "ab.rewind": loadImg("imageAssets/ab/rewind.png"),
    "ab.backtrack": loadImg("imageAssets/ab/backtrack.png"),

    "ab.atonement": loadImg("imageAssets/ab/atonement.png"),
    "ab.depart": loadImg("imageAssets/ab/depart.png"),

    "ab.bandages": loadImg("imageAssets/ab/bandages.png"),
    "ab.latch": loadImg("imageAssets/ab/latch.png"),

    "ab.spark": loadImg("imageAssets/ab/spark.png"),
    "ab.lightning": loadImg("imageAssets/ab/lightning.png"),
    "ab.charge": loadImg("imageAssets/ab/charge.png"),

    "ab.magnetism_down": loadImg("imageAssets/ab/magnetism_down.png"),
    "ab.magnetism_up": loadImg("imageAssets/ab/magnetism_up.png"),

    "ab.masonry": loadImg("imageAssets/ab/masonry.png"),
    "ab.tether": loadImg("imageAssets/ab/tether.png"),

    "ab.burrow": loadImg("imageAssets/ab/burrow.png"),
    "ab.pit": loadImg("imageAssets/ab/pit.png"),
  }
}

function loadFonts(){
  fnt = {
    tahomaBold: loadFont("fontAssets/tahomabd.ttf")
  }
}