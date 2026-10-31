// The built-in line set (bodies, faces, colours, line settings) as shipped JSON text.
// Read and checked once by builtInLineSet(); kept as text so the reader sees exactly what shipped.
export const BUILT_IN_LINE_SET_JSON = `{
 "master": {
  "size": 320,
  "middleX": 160,
  "groundY": 250,
  "swatchBox": [16, 12, 288, 288],
  "swatchBoxWithHat": [4, -34, 312, 312],
  "standsOn": [160, 250]
 },
 "bodies": {
  "items": {
   "tofu": {
    "outline": "M114 86 C138 81 184 81 206 86 C240 91 253 108 256 140 C258 160 258 182 255 202 C251 234 236 247 204 250 C180 252 140 252 116 250 C84 247 69 234 65 202 C62 182 62 160 64 140 C67 106 82 91 114 86Z",
    "innerLine": null,
    "eyeLineY": 166,
    "eyeHalfSpacing": 27,
    "headTop": [160, 83],
    "headphones": {
     "band": "M65 142 C59 31 261 31 255 142",
     "cupLeft": "M48 152 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z",
     "cupRight": "M246 152 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z"
    },
    "sunglasses": {
     "lensesFilled": "M107 162 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M175 162 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z",
     "lensesBridgeAndArms": "M107 162 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M175 162 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M145 160 q15 -6 30 0 M107 160 L69 152 M213 160 L251 152"
    }
   },
   "flower5": {
    "outline": "M160 70 C166.7 70 174 71.5 180.1 74.1 C186.2 76.8 192.5 80.6 196.6 85.9 C200.7 91.2 199.6 102.3 204.7 105.9 C209.7 109.4 220.4 105 226.9 107.1 C233.4 109.2 239.1 113.8 243.6 118.6 C248.1 123.3 251.8 129.6 253.9 135.7 C255.9 141.8 256.7 148.9 256 155.3 C255.3 161.8 253.4 168.7 249.5 174.1 C245.5 179.5 234.2 182 232.3 187.7 C230.3 193.4 238 201.8 237.9 208.4 C237.8 215 235.1 221.7 231.7 227.3 C228.4 232.9 223.4 238.2 218 242 C212.6 245.8 205.8 248.7 199.3 250 C192.7 251.3 185.3 251.8 178.7 249.8 C172.2 247.9 166.2 238.3 160 238.3 C153.8 238.3 147.8 247.9 141.3 249.8 C134.7 251.8 127.3 251.3 120.7 250 C114.2 248.7 107.4 245.8 102 242 C96.6 238.2 91.6 232.9 88.3 227.3 C84.9 221.7 82.2 215 82.1 208.4 C82 201.8 89.7 193.4 87.7 187.7 C85.8 182 74.5 179.5 70.5 174.1 C66.6 168.7 64.7 161.8 64 155.3 C63.3 148.9 64.1 141.8 66.1 135.7 C68.2 129.6 71.9 123.3 76.4 118.6 C80.9 113.8 86.6 109.2 93.1 107.1 C99.6 105 110.3 109.4 115.3 105.9 C120.4 102.3 119.3 91.2 123.4 85.9 C127.5 80.6 133.8 76.8 139.9 74.1 C146 71.5 153.3 70 160 70Z",
    "innerLine": null,
    "eyeLineY": 160,
    "eyeHalfSpacing": 25,
    "headTop": [160, 70],
    "headphones": {
     "band": "M68 122 C62 23 258 23 252 122",
     "cupLeft": "M51 132 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z",
     "cupRight": "M243 132 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z"
    },
    "sunglasses": {
     "lensesFilled": "M109 156 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M173 156 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z",
     "lensesBridgeAndArms": "M109 156 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M173 156 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M147 154 q13 -6 26 0 M109 154 L72 146 M211 154 L248 146"
    }
   },
   "drop": {
    "outline": "M160 62 C176 92 244 140 244 186 C244 226 208 250 160 250 C112 250 76 226 76 186 C76 140 144 92 160 62Z",
    "innerLine": null,
    "eyeLineY": 180,
    "eyeHalfSpacing": 24,
    "headTop": [160, 64],
    "headphones": {
     "band": "M79 158 C73 1 247 1 241 158",
     "cupLeft": "M62 168 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z",
     "cupRight": "M232 168 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z"
    },
    "sunglasses": {
     "lensesFilled": "M110 176 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M172 176 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z",
     "lensesBridgeAndArms": "M110 176 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M172 176 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M148 174 q12 -6 24 0 M110 174 L83 166 M210 174 L237 166"
    }
   },
   "bean": {
    "outline": "M100 112 C130 104 146 124 160 124 C174 124 190 104 220 112 C250 120 258 150 256 180 C254 232 212 252 160 252 C108 252 66 232 64 180 C62 150 70 120 100 112Z",
    "innerLine": null,
    "eyeLineY": 180,
    "eyeHalfSpacing": 26,
    "headTop": [160, 124],
    "headphones": {
     "band": "M67 134 C61 65 259 65 253 134",
     "cupLeft": "M50 144 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z",
     "cupRight": "M244 144 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z"
    },
    "sunglasses": {
     "lensesFilled": "M108 176 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M174 176 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z",
     "lensesBridgeAndArms": "M108 176 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M174 176 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M146 174 q14 -6 28 0 M108 174 L71 166 M212 174 L249 166"
    }
   },
   "acorn": {
    "outline": "M160 78 C214 78 252 104 256 136 C257 146 250 150 238 150 C240 196 206 240 164 252 C162 253 158 253 156 252 C114 240 80 196 82 150 C70 150 63 146 64 136 C68 104 106 78 160 78Z",
    "innerLine": "M160 78 C160 70 163 64 170 60",
    "eyeLineY": 184,
    "eyeHalfSpacing": 24,
    "headTop": [160, 80],
    "headphones": {
     "band": "M68 112 C62 37 258 37 252 112",
     "cupLeft": "M51 122 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z",
     "cupRight": "M243 122 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z"
    },
    "sunglasses": {
     "lensesFilled": "M110 180 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M172 180 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z",
     "lensesBridgeAndArms": "M110 180 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M172 180 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M148 178 q12 -6 24 0 M110 178 L72 170 M210 178 L248 170"
    }
   },
   "leaf": {
    "outline": "M74 214 C60 176 88 122 150 106 C196 94 236 100 258 94 C254 126 244 180 208 218 C176 250 118 258 92 240 C82 234 77 224 74 214Z",
    "innerLine": "M82 230 C74 240 64 246 52 248",
    "eyeLineY": 176,
    "eyeHalfSpacing": 25,
    "headTop": [150, 104],
    "headphones": {
     "band": "M72 152 C66 50 250 50 244 122",
     "cupLeft": "M55 162 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z",
     "cupRight": "M235 132 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z"
    },
    "sunglasses": {
     "lensesFilled": "M109 172 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M173 172 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z",
     "lensesBridgeAndArms": "M109 172 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M173 172 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M147 170 q13 -6 26 0 M109 170 L76 162 M211 170 L240 162"
    }
   },
   "stone": {
    "outline": "M96 250 C74 250 64 236 66 214 C70 170 92 116 150 108 C200 102 244 130 254 178 C260 208 256 250 222 250Z",
    "innerLine": null,
    "eyeLineY": 190,
    "eyeHalfSpacing": 26,
    "headTop": [150, 108],
    "headphones": {
     "band": "M69 168 C63 51 259 51 253 168",
     "cupLeft": "M52 178 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z",
     "cupRight": "M244 178 q0 -10 10 -10 h6 q10 0 10 10 v36 q0 10 -10 10 h-6 q-10 0 -10 -10Z"
    },
    "sunglasses": {
     "lensesFilled": "M108 186 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M174 186 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z",
     "lensesBridgeAndArms": "M108 186 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M174 186 q0 -10 10 -10 h18 q10 0 10 10 v6 q0 12 -12 12 h-14 q-12 0 -12 -12Z M146 184 q14 -6 28 0 M108 184 L73 176 M212 184 L249 176"
    }
   }
  }
 },
 "faces": {
  "items": {
   "idle": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": 0
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": 0,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     },
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": 0,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     }
    ],
    "marks": []
   },
   "listening": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": 6
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 2,
      "offsetY": -2,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 14
     },
     {
      "kind": "oval",
      "offsetX": 2,
      "offsetY": -2,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 14
     }
    ],
    "marks": ["M270 132 q12 22 0 44", "M286 118 q20 36 0 72"],
    "marksMotion": {
     "mode": "stagger",
     "period": 2,
     "delay": 0.25
    },
    "markMiddles": [[273, 154], [291, 154]]
   },
   "thinking": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": -4
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 9,
      "offsetY": -10,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 12
     },
     {
      "kind": "oval",
      "offsetX": 9,
      "offsetY": -10,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 12
     }
    ],
    "marks": ["M240 96 c10 -22 38 -18 34 2 c-3 16 -24 14 -20 0 c4 -12 26 -22 40 -34"],
    "marksMotion": {
     "mode": "trim",
     "period": 2.6
    },
    "markMiddles": [[267, 86.6]]
   },
   "speaking": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": 0
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": 0,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     },
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": 0,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     }
    ],
    "marks": ["M270 156 h24", "M266 178 h34", "M270 200 h20"],
    "marksMotion": {
     "mode": "stagger",
     "period": 1.5,
     "delay": 0.16
    },
    "markMiddles": [[282, 156], [283, 178], [280, 200]]
   },
   "delighted": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": -10,
     "leanDegrees": 0
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "arc",
      "offsetX": 0,
      "offsetY": 6,
      "blinks": false,
      "halfWidth": 12,
      "rise": 18
     },
     {
      "kind": "arc",
      "offsetX": 0,
      "offsetY": 6,
      "blinks": false,
      "halfWidth": 12,
      "rise": 18
     }
    ],
    "marks": ["M60 84 l-14 -12", "M80 64 l-4 -18", "M52 110 l-18 -2", "M260 84 l14 -12", "M240 64 l4 -18", "M268 110 l18 -2"],
    "marksMotion": {
     "mode": "stagger",
     "period": 1.8,
     "delay": 0.08
    },
    "markMiddles": [[53, 78], [78, 55], [43, 109], [267, 78], [242, 55], [277, 109]]
   },
   "confused": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": -3
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": 0,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     },
     {
      "kind": "dash",
      "offsetX": 0,
      "offsetY": 2,
      "blinks": false,
      "halfWidth": 10
     }
    ],
    "marks": ["M246 64 q8 -20 28 -12 q16 8 2 24 q-10 10 -10 22", "M266 122 v1"],
    "marksMotion": {
     "mode": "hold"
    },
    "markMiddles": [[264.3, 73.9], [266, 122.5]]
   },
   "sleeping": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 6,
     "leanDegrees": 0
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "shut",
      "offsetX": 0,
      "offsetY": 2,
      "blinks": false,
      "halfWidth": 10,
      "rise": 8
     },
     {
      "kind": "shut",
      "offsetX": 0,
      "offsetY": 2,
      "blinks": false,
      "halfWidth": 10,
      "rise": 8
     }
    ],
    "marks": ["M246 92 h18 l-18 18 h18", "M274 56 h12 l-12 12 h12"],
    "marksMotion": {
     "mode": "float",
     "period": 3.4,
     "delay": 1.5
    },
    "markMiddles": [[255, 101], [280, 62]]
   },
   "error": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": 2
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "cross",
      "offsetX": 0,
      "offsetY": 0,
      "blinks": false,
      "halfWidth": 7,
      "halfHeight": 10
     },
     {
      "kind": "cross",
      "offsetX": 0,
      "offsetY": 0,
      "blinks": false,
      "halfWidth": 7,
      "halfHeight": 10
     }
    ],
    "marks": []
   },
   "surprised": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": -6,
     "leanDegrees": 0
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": -1,
      "offsetY": -4,
      "blinks": true,
      "halfWidth": 13,
      "halfHeight": 16
     },
     {
      "kind": "oval",
      "offsetX": 1,
      "offsetY": -4,
      "blinks": true,
      "halfWidth": 13,
      "halfHeight": 16
     }
    ],
    "marks": ["M160 48 v-22", "M116 58 l-10 -18", "M204 58 l10 -18"],
    "marksMotion": {
     "mode": "stagger",
     "period": 1.4,
     "delay": 0.05
    },
    "marksWithHat": ["M84 74 l-16 -12", "M236 74 l16 -12"],
    "markMiddles": [[160, 37], [111, 49], [209, 49]]
   },
   "curious": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": 8
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": 0,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     },
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": -4,
      "blinks": true,
      "halfWidth": 12,
      "halfHeight": 17
     }
    ],
    "marks": ["M266 64 l8 -12", "M282 76 l16 -8", "M286 94 l18 0"],
    "marksMotion": {
     "mode": "stagger",
     "period": 2,
     "delay": 0.22
    },
    "markMiddles": [[270, 58], [290, 72], [295, 94]]
   },
   "proud": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": -6,
     "leanDegrees": -3
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "arc",
      "offsetX": 0,
      "offsetY": 6,
      "blinks": false,
      "halfWidth": 12,
      "rise": 14
     },
     {
      "kind": "arc",
      "offsetX": 0,
      "offsetY": 6,
      "blinks": false,
      "halfWidth": 12,
      "rise": 14
     }
    ],
    "marks": ["M272 76 Q272 91 287 91 Q272 91 272 106 Q272 91 257 91 Q272 91 272 76Z", "M292 120 Q292 128 300 128 Q292 128 292 136 Q292 128 284 128 Q292 128 292 120Z"],
    "marksMotion": {
     "mode": "twinkle",
     "period": 2.2,
     "delay": 0.8,
     "group": 1
    },
    "markMiddles": [[272, 91], [292, 128]]
   },
   "peeking": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 24,
     "leanDegrees": 0
    },
    "behindLedge": true,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 8,
      "offsetY": -6,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     },
     {
      "kind": "oval",
      "offsetX": 8,
      "offsetY": -6,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     }
    ],
    "marks": []
   },
   "wink": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": -3
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": 0,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     },
     {
      "kind": "arc",
      "offsetX": 0,
      "offsetY": 6,
      "blinks": false,
      "halfWidth": 10,
      "rise": 14
     }
    ],
    "marks": ["M274 88 Q274 106 292 106 Q274 106 274 124 Q274 106 256 106 Q274 106 274 88Z"],
    "marksMotion": {
     "mode": "hold"
    },
    "markMiddles": [[274, 106]]
   },
   "sorry": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 8,
     "leanDegrees": -2
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": 8,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 11
     },
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": 8,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 11
     }
    ],
    "brows": [
     {
      "points": [[-18, -20], [-5, -25], [8, -30]]
     },
     {
      "points": [[18, -20], [5, -25], [-8, -30]]
     }
    ],
    "marks": []
   },
   "onIt": {
    "bodyPose": {
     "shiftX": 6,
     "shiftY": 0,
     "leanDegrees": 6
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": -2,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 14
     },
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": -2,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 14
     }
    ],
    "brows": [
     {
      "points": [[-20, -28], [-5, -23], [10, -18]]
     },
     {
      "points": [[20, -28], [5, -23], [-10, -18]]
     }
    ],
    "marks": ["M60 150 h-30", "M52 178 h-40", "M60 206 h-22"],
    "marksMotion": {
     "mode": "stagger",
     "period": 1,
     "delay": 0.13
    },
    "markMiddles": [[45, 150], [32, 178], [49, 206]]
   },
   "waiting": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 4,
     "leanDegrees": 3
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "lid",
      "offsetX": 0,
      "offsetY": -4,
      "blinks": true,
      "halfWidth": 10,
      "halfHeight": 12
     },
     {
      "kind": "lid",
      "offsetX": 0,
      "offsetY": -4,
      "blinks": true,
      "halfWidth": 10,
      "halfHeight": 12
     }
    ],
    "marks": ["M262 112 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0Z", "M280 112 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0Z", "M298 112 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0Z"],
    "marksMotion": {
     "mode": "ellipsis",
     "period": 1.8
    },
    "markMiddles": [[265.5, 112], [283.5, 112], [301.5, 112]]
   },
   "celebrating": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": -16,
     "leanDegrees": 0
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "arc",
      "offsetX": 0,
      "offsetY": 0,
      "blinks": false,
      "halfWidth": 14,
      "rise": 22
     },
     {
      "kind": "arc",
      "offsetX": 0,
      "offsetY": 0,
      "blinks": false,
      "halfWidth": 14,
      "rise": 22
     }
    ],
    "marks": ["M57 84 L70 84", "M54.9 88.9 L64.1 98.1", "M50 91 L50 104", "M45.1 88.9 L35.9 98.1", "M43 84 L30 84", "M45.1 79.1 L35.9 69.9", "M50 77 L50 64", "M54.9 79.1 L64.1 69.9", "M276.4 66.7 L288.4 71.8", "M272.6 70.5 L277.5 82.5", "M267.3 70.4 L262.2 82.4", "M263.5 66.6 L251.5 71.5", "M263.6 61.3 L251.6 56.2", "M267.4 57.5 L262.5 45.5", "M272.7 57.6 L277.8 45.6", "M276.5 61.4 L288.5 56.5"],
    "marksMotion": {
     "mode": "firework",
     "period": 1.6,
     "delay": 0.8
    },
    "markMiddles": [[63.5, 84], [59.5, 93.5], [50, 97.5], [40.5, 93.5], [36.5, 84], [40.5, 74.5], [50, 70.5], [59.5, 74.5], [282.4, 69.3], [275.1, 76.5], [264.8, 76.4], [257.5, 69], [257.6, 58.8], [264.9, 51.5], [275.3, 51.6], [282.5, 59]]
   },
   "coding": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": 4
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": -5,
      "offsetY": 10,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 12
     },
     {
      "kind": "oval",
      "offsetX": -5,
      "offsetY": 10,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 12
     }
    ],
    "marks": ["M266 94 l-11 12 l11 12", "M300 94 l11 12 l-11 12", "M289 88 l-8 36"],
    "marksMotion": {
     "mode": "cursor",
     "period": 1.1
    },
    "markMiddles": [[260.5, 106], [305.5, 106], [285, 106]]
   },
   "working": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": 0
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": 9,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 12
     },
     {
      "kind": "oval",
      "offsetX": 0,
      "offsetY": 9,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 12
     }
    ],
    "marks": [],
    "glanceShare": 0.2,
    "eyesPath": {
     "periodSeconds": 3.4,
     "keys": [[0, 0, 0], [0.1, -5, 1], [0.19, -5, 0], [0.31, 5, 1], [0.4, 5, 0], [0.5, 0, 2], [0.69, 0, 1], [0.79, 0, -7], [0.93, 0, -7], [1, 0, 0]]
    },
    "bodyRound": {
     "periodSeconds": 3.4,
     "keys": [[0, 0, 0, 0], [0.1, -14, 8, -5], [0.19, -14, 0, -5], [0.31, 14, 8, 5], [0.4, 14, 0, 5], [0.5, 0, 8, 0], [0.56, 0, 0, 0], [0.63, 0, 8, 0], [0.69, 0, 0, 0], [0.79, 0, -5, -6], [0.93, 0, -5, -6], [1, 0, 0, 0]]
    }
   },
   "writing": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": 3
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 5,
      "offsetY": 5,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     },
     {
      "kind": "oval",
      "offsetX": 5,
      "offsetY": 5,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     }
    ],
    "marks": ["M220 261 L252 205.6 M235 235 C222.7 216.4 231 181.9 256.9 169.1 C267.9 164 281.9 169.7 282.1 181.4 C282.5 190.8 279.3 198.3 273.7 202 C269.1 203.9 266.4 204.6 267.7 212.3 C269.8 222.8 257.6 231.9 237 231.6 Z"],
    "glanceShare": 0.3,
    "eyesPath": {
     "periodSeconds": 2.3333333333333335,
     "keys": [[0, 3, 0], [0.6, -2, 0], [0.75, -2, -1], [1, 3, 0]]
    },
    "marksOverBody": true,
    "marksFilled": [0],
    "marksMotion": {
     "mode": "frames",
     "drawingsPerSecond": 6,
     "drawingsPerRound": 14,
     "shiftXByDrawing": [0, -3, -6, -9, -12, -15, -18, -21, -24, -24, -24, -12, 0, 0],
     "shiftYByDrawing": [0, -5, 0, -5, 0, -5, 0, -5, 0, -10, -10, -10, -10, 0]
    },
    "markMiddles": [[251.1, 214.1]]
   },
   "reading": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": 3
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 4,
      "offsetY": 5,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     },
     {
      "kind": "oval",
      "offsetX": 4,
      "offsetY": 5,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     }
    ],
    "marks": ["M286 244 q-22 -9 -44 3 q-22 -12 -44 -3 v19 q22 -9 44 3 q22 -12 44 -3 Z M242 247 v19", "M242 247 Q223.9 229.5 203.2 226.3", "M242 247 Q235.1 222.8 218.7 209.7", "M242 247 Q235 222.8 242 203", "M242 247 Q248.9 222.8 265.3 209.7", "M242 247 Q260.1 229.5 280.8 226.3"],
    "glanceShare": 0.3,
    "eyesPath": {
     "periodSeconds": 2.5,
     "keys": [[0, 3, 0], [0.24, -2, 0], [0.3, 3, 1], [0.5, -2, 1], [0.56, 0, -1], [0.85, 0, -1], [1, 3, 0]]
    },
    "marksOverBody": true,
    "marksFilled": [0],
    "marksMotion": {
     "mode": "frames",
     "drawingsPerSecond": 6,
     "drawingsPerRound": 15,
     "shownIn": [null, [8], [9], [10], [11], [12]]
    },
    "markMiddles": [[242, 253.1], [222.6, 236.7], [230.3, 228.3], [240.3, 225], [253.6, 228.3], [261.4, 236.7]]
   },
   "building": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": 0
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 2,
      "offsetY": 9,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 12
     },
     {
      "kind": "oval",
      "offsetX": 2,
      "offsetY": 9,
      "blinks": true,
      "halfWidth": 8,
      "halfHeight": 12
     }
    ],
    "marks": ["M247.3 233.9 L282.8 183.1 Q289.2 174.1 297.3 179.8 Q305.5 185.6 299.2 194.6 L263.7 245.4 C272.8 256.7 266.3 276.5 249.4 286.6 L239.6 279.8 L249.3 265.8 L232.9 254.4 L223.2 268.3 L213.4 261.4 C217.1 242.1 233.5 229.1 247.3 233.9 Z"],
    "glanceShare": 0.2,
    "eyesPath": {
     "periodSeconds": 3.3333333333333335,
     "keys": [[0, 0, 0], [0.1, 5, 1], [0.19, 5, 0], [0.31, -5, 1], [0.4, -5, 0], [0.5, 3, 2], [0.69, 3, 1], [0.79, 0, -7], [0.93, 0, -7], [1, 0, 0]]
    },
    "bodyRound": {
     "periodSeconds": 3.3333333333333335,
     "keys": [[0, 0, 0, 0], [0.1, 14, 8, 5], [0.19, 14, 0, 5], [0.31, -14, 8, -5], [0.4, -14, 0, -5], [0.5, 0, 8, 0], [0.56, 0, 0, 0], [0.63, 0, 8, 0], [0.69, 0, 0, 0], [0.79, 0, -5, 6], [0.93, 0, -5, 6], [1, 0, 0, 0]]
    },
    "marksOverBody": true,
    "marksFilled": [0],
    "marksCarried": true,
    "marksMotion": {
     "mode": "frames",
     "drawingsPerSecond": 6,
     "drawingsPerRound": 20,
     "turnDegreesByDrawing": [0, 0, 14, 14, 0, 0, 14, 14, 0, 0, 14, 0, 14, 0, 0, 0, 0, 0, 0, 0],
     "turnsAbout": [244, 256]
    },
    "markMiddles": [[257.7, 232.1]]
   },
   "connecting": {
    "bodyPose": {
     "shiftX": 0,
     "shiftY": 0,
     "leanDegrees": 2
    },
    "behindLedge": false,
    "eyes": [
     {
      "kind": "oval",
      "offsetX": 5,
      "offsetY": -4,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     },
     {
      "kind": "oval",
      "offsetX": 5,
      "offsetY": -4,
      "blinks": true,
      "halfWidth": 9,
      "halfHeight": 13
     }
    ],
    "marks": ["M259 108 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0Z", "M295 80 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0Z", "M271.9 101.9 l6.3 -4.9", "M292.1 86.1 l-6.3 4.9", "M271.9 101.9 l20.2 -15.8"],
    "glanceShare": 0.3,
    "marksMotion": {
     "mode": "frames",
     "drawingsPerSecond": 4,
     "drawingsPerRound": 12,
     "shownIn": [null, null, [2, 3], [2, 3], [4, 5, 6, 7, 8, 9]]
    },
    "markMiddles": [[264, 108], [300, 80], [275, 99.5], [289, 88.5], [282, 94]]
   }
  }
 },
 "marksPlacement": {
  "byBody": {
   "tofu": {
    "listening": [[16, -2], [16, -2]],
    "thinking": [[10, -7]],
    "speaking": [[10, 1], [10, 1], [10, 1]],
    "delighted": [[-3, -2], [-3, -2], [-3, -2], [3, -2], [3, -2], [3, -2]],
    "confused": [[0, 0], [0, 0]],
    "sleeping": [[12, -10], [12, -10]],
    "surprised": [[0, 0], [0, 0], [0, 0]],
    "curious": [[0, 0], [0, 0], [0, 0]],
    "proud": [[0, 0], [0, 0]],
    "wink": [[2, -1]],
    "onIt": [[-2, 0], [-2, 0], [-2, 0]],
    "waiting": [[9, -4], [9, -4], [9, -4]],
    "celebrating": [[-10, -6], [-10, -6], [-10, -6], [-10, -6], [-10, -6], [-10, -6], [-10, -6], [-10, -6], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    "coding": [[14, -7], [14, -7], [14, -7]],
    "connecting": [[10, -6], [10, -6], [10, -6], [10, -6], [10, -6]]
   },
   "flower5": {
    "listening": [[12, -1], [12, -1]],
    "thinking": [[2, -1]],
    "speaking": [[4, 1], [4, 1], [4, 1]],
    "delighted": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    "confused": [[0, 0], [0, 0]],
    "sleeping": [[5, -4], [5, -4]],
    "surprised": [[0, -4], [0, 0], [0, 0]],
    "curious": [[0, 0], [0, 0], [0, 0]],
    "proud": [[0, 0], [0, 0]],
    "wink": [[0, 0]],
    "onIt": [[0, 0], [0, 0], [0, 0]],
    "waiting": [[0, 0], [0, 0], [0, 0]],
    "celebrating": [[-5, -3], [-5, -3], [-5, -3], [-5, -3], [-5, -3], [-5, -3], [-5, -3], [-5, -3], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    "coding": [[4, -2], [4, -2], [4, -2]],
    "connecting": [[3, -2], [3, -2], [3, -2], [3, -2], [3, -2]]
   },
   "drop": {
    "listening": [[0, 0], [0, 0]],
    "thinking": [[0, 0]],
    "speaking": [[0, 0], [0, 0], [0, 0]],
    "delighted": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    "confused": [[0, 0], [0, 0]],
    "sleeping": [[0, 0], [0, 0]],
    "surprised": [[0, -12], [0, 0], [0, 0]],
    "curious": [[0, 0], [0, 0], [0, 0]],
    "proud": [[0, 0], [0, 0]],
    "wink": [[0, 0]],
    "onIt": [[0, 0], [0, 0], [0, 0]],
    "waiting": [[0, 0], [0, 0], [0, 0]],
    "celebrating": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    "coding": [[0, 0], [0, 0], [0, 0]],
    "connecting": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
   },
   "bean": {
    "listening": [[14, -3], [14, -3]],
    "thinking": [[0, 0]],
    "speaking": [[10, 0], [10, 0], [10, 0]],
    "delighted": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    "confused": [[0, 0], [0, 0]],
    "sleeping": [[0, 0], [0, 0]],
    "surprised": [[0, 0], [0, 0], [0, 0]],
    "curious": [[0, 0], [0, 0], [0, 0]],
    "proud": [[0, 0], [0, 0]],
    "wink": [[0, 0]],
    "onIt": [[0, 0], [0, 0], [0, 0]],
    "waiting": [[0, 0], [0, 0], [0, 0]],
    "celebrating": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    "coding": [[0, 0], [0, 0], [0, 0]],
    "connecting": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
   },
   "acorn": {
    "listening": [[14, -1], [14, -1]],
    "thinking": [[8, -6]],
    "speaking": [[0, 0], [0, 0], [0, 0]],
    "delighted": [[-3, -2], [-3, -2], [-3, -2], [3, -2], [3, -2], [3, -2]],
    "confused": [[2, -1], [2, -1]],
    "sleeping": [[11, -9], [11, -9]],
    "surprised": [[0, 0], [0, 0], [0, 0]],
    "curious": [[0, 0], [0, 0], [0, 0]],
    "proud": [[0, 0], [0, 0]],
    "wink": [[0, 0]],
    "onIt": [[0, 0], [0, 0], [0, 0]],
    "waiting": [[7, -4], [7, -4], [7, -4]],
    "celebrating": [[-9, -5], [-9, -5], [-9, -5], [-9, -5], [-9, -5], [-9, -5], [-9, -5], [-9, -5], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    "coding": [[11, -5], [11, -5], [11, -5]],
    "connecting": [[7, -4], [7, -4], [7, -4], [7, -4], [7, -4]]
   },
   "leaf": {
    "listening": [[18, -3], [18, -3]],
    "thinking": [[22, -17]],
    "speaking": [[0, 0], [0, 0], [0, 0]],
    "delighted": [[0, 0], [0, 0], [0, 0], [12, -10], [12, -10], [12, -10]],
    "confused": [[1, -1], [1, -1]],
    "sleeping": [[25, -23], [25, -23]],
    "surprised": [[0, 0], [0, 0], [0, 0]],
    "curious": [[1, -1], [1, -1], [1, -1]],
    "proud": [[7, -3], [7, -3]],
    "wink": [[7, -4]],
    "onIt": [[0, 0], [0, 0], [0, 0]],
    "waiting": [[23, -13], [23, -13], [23, -13]],
    "celebrating": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [12, -10], [12, -10], [12, -10], [12, -10], [12, -10], [12, -10], [12, -10], [12, -10]],
    "coding": [[27, -17], [27, -17], [27, -17]],
    "connecting": [[23, -16], [23, -16], [23, -16], [23, -16], [23, -16]]
   },
   "stone": {
    "listening": [[8, -2], [8, -2]],
    "thinking": [[0, 0]],
    "speaking": [[8, 0], [8, 0], [8, 0]],
    "delighted": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    "confused": [[0, 0], [0, 0]],
    "sleeping": [[0, 0], [0, 0]],
    "surprised": [[0, 0], [0, 0], [0, 0]],
    "curious": [[0, 0], [0, 0], [0, 0]],
    "proud": [[0, 0], [0, 0]],
    "wink": [[0, 0]],
    "onIt": [[-4, 0], [-4, 0], [-4, 0]],
    "waiting": [[0, 0], [0, 0], [0, 0]],
    "celebrating": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    "coding": [[0, 0], [0, 0], [0, 0]],
    "connecting": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
   }
  },
  "surprisedWithHatByBody": {
   "tofu": [[-3, -3], [3, -3]],
   "flower5": [[0, 0], [0, 0]],
   "drop": [[0, 0], [0, 0]],
   "bean": [[0, 0], [0, 0]],
   "acorn": [[-1, -1], [1, -1]],
   "leaf": [[0, 0], [1, -2]],
   "stone": [[0, 0], [0, 0]]
  }
 },
 "accessories": {
  "drawnForHeadTopAt": [160, 72],
  "turnsAbout": [160, 84],
  "spotSlipShare": [0.7, 0.75],
  "items": {
   "partyHat": {
    "tiltDegrees": -9,
    "lift": 12,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": null,
    "spots": [
     {
      "path": "M131 86 L163 14 L191 86 Q161 98 131 86Z",
      "colour": "matcha"
     },
     {
      "path": "M163 13 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0Z",
      "colour": "heather"
     }
    ],
    "lines": ["M131 86 L163 16", "M191 86 L163 16", "M131 86 q30 12 60 0", "M144 58 q18 8 36 0", "M163 13 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0Z"]
   },
   "bowler": {
    "tiltDegrees": -5,
    "lift": 10,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M122 80 C120 34 200 34 198 80 L220 80 q-60 18 -120 0 L122 80Z"],
    "spots": [
     {
      "path": "M122 80 C120 34 200 34 198 80 Q160 92 122 80Z",
      "colour": "matcha"
     }
    ],
    "lines": ["M122 80 C120 34 200 34 198 80", "M100 80 q60 18 120 0", "M123 66 q37 10 74 0"]
   },
   "crown": {
    "tiltDegrees": 4,
    "lift": 10,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": null,
    "spots": [
     {
      "path": "M120 84 L116 40 L142 62 L160 30 L178 62 L204 40 L200 84 Q160 94 120 84Z",
      "colour": "matcha"
     }
    ],
    "lines": ["M120 84 L116 40 L142 62 L160 30 L178 62 L204 40 L200 84", "M120 84 q40 10 80 0"]
   },
   "headphones": {
    "tiltDegrees": 0,
    "lift": 0,
    "floats": false,
    "onFace": false,
    "fromEars": true,
    "silhouette": null,
    "spots": [],
    "lines": [],
    "builtFromEars": {
     "spots": [
      {
       "part": "cupLeft",
       "colour": "heather"
      },
      {
       "part": "cupRight",
       "colour": "heather"
      }
     ],
     "lines": ["band", "cupLeft", "cupRight"]
    }
   },
   "sunglasses": {
    "tiltDegrees": 0,
    "lift": 0,
    "floats": false,
    "onFace": true,
    "fromEars": false,
    "silhouette": null,
    "spots": [],
    "lines": []
   },
   "sprout": {
    "tiltDegrees": 3,
    "lift": 0,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": null,
    "spots": [
     {
      "path": "M161 46 C140 42 130 24 134 14 C152 16 163 30 161 46Z",
      "colour": "matcha"
     },
     {
      "path": "M162 42 C177 38 193 22 191 10 C172 12 160 28 162 42Z",
      "colour": "matcha"
     }
    ],
    "lines": ["M160 76 C161 60 158 52 162 40", "M161 46 C140 42 130 24 134 14 C152 16 163 30 161 46Z", "M162 42 C177 38 193 22 191 10 C172 12 160 28 162 42Z"]
   },
   "halo": {
    "tiltDegrees": -6,
    "lift": 0,
    "floats": true,
    "onFace": false,
    "fromEars": false,
    "silhouette": null,
    "spots": [],
    "lines": ["M116 44 a44 12 0 1 0 88 0 a44 12 0 1 0 -88 0Z"]
   },
   "nightcap": {
    "tiltDegrees": 8,
    "lift": 10,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M128 84 C132 52 148 26 172 24 C192 22 204 36 207 52 C201 49 194 49 190 54 C192 64 192 74 192 84 Q160 96 128 84Z"],
    "spots": [
     {
      "path": "M129 70 C134 50 150 26 172 24 C192 22 204 36 207 52 C201 49 194 49 190 54 C191 60 191 65 191 70 Q160 81 129 70Z",
      "colour": "heather"
     }
    ],
    "lines": ["M128 84 C132 52 148 26 172 24 C192 22 204 36 207 52", "M192 84 C192 72 192 62 190 54 C194 49 201 49 206 53", "M126 84 q34 12 68 0", "M129 70 q31 11 62 0", "M208 62 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0Z"]
   },
   "cap": {
    "tiltDegrees": 6,
    "lift": 8,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M130 82 C128 42 194 42 194 82 Q162 94 136 88 C122 94 104 97 88 90 C94 80 112 76 130 82Z"],
    "spots": [
     {
      "path": "M130 82 C128 42 194 42 194 82 Q162 94 130 82Z M131 80 C112 76 94 80 88 90 C104 97 122 94 136 88Z",
      "colour": "heather"
     }
    ],
    "lines": ["M130 82 C128 42 194 42 194 82", "M130 82 q32 12 64 0", "M131 80 C112 76 94 80 88 90 C104 97 122 94 136 88", "M161 50 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0Z"]
   },
   "beanie": {
    "tiltDegrees": 6,
    "lift": 8,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M124 82 C120 28 200 28 196 82 Q160 95 124 82Z"],
    "spots": [
     {
      "path": "M125 68 C126 32 194 32 195 68 Q160 80 125 68Z",
      "colour": "matcha"
     }
    ],
    "lines": ["M124 82 C120 28 200 28 196 82", "M122 82 q38 13 76 0", "M125 68 q35 12 70 0", "M160 33 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0Z"]
   },
   "topHat": {
    "tiltDegrees": -7,
    "lift": 10,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M133 80 L129 30 Q160 22 191 30 L187 80 L214 80 q-54 18 -108 0 L133 80Z"],
    "spots": [
     {
      "path": "M133 80 L129 30 Q160 22 191 30 L187 80 Q160 90 133 80Z",
      "colour": "heather"
     }
    ],
    "lines": ["M133 80 L129 31", "M129 30 Q160 22 191 30", "M187 80 L191 31", "M106 80 q54 18 108 0", "M132 64 q28 9 56 0"]
   },
   "gradCap": {
    "tiltDegrees": -6,
    "lift": 8,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M160 28 L216 46 L186 57 L184 84 Q160 93 136 84 L134 57 L104 46Z"],
    "spots": [
     {
      "path": "M134 57 L136 84 Q160 93 184 84 L186 57 L160 64Z M160 28 L216 46 L160 64 L104 46Z",
      "colour": "heather"
     }
    ],
    "lines": ["M160 28 L216 46 L160 64 L104 46Z", "M134 57 C134 68 135 76 136 84 M186 57 C186 68 185 76 184 84", "M136 84 q24 9 48 0", "M160 46 C140 46 124 48 118 52 L117 78"]
   },
   "chefHat": {
    "tiltDegrees": -6,
    "lift": 10,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M136 84 L134 60 C114 54 116 26 140 30 C146 12 178 12 184 30 C206 26 208 54 188 60 L186 84 Q161 94 136 84Z"],
    "spots": [],
    "lines": ["M134 60 C114 54 116 26 140 30 C146 12 178 12 184 30 C206 26 208 54 188 60", "M134 60 L136 84", "M188 60 L186 84", "M136 84 q25 10 50 0", "M134 60 q27 10 54 0"]
   },
   "propeller": {
    "tiltDegrees": 0,
    "lift": 8,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M130 82 C128 46 192 46 192 82 Q161 94 130 82Z"],
    "spots": [
     {
      "path": "M130 82 C129 62 140 55 161 55 L161 88 Q146 88 130 82Z",
      "colour": "matcha"
     },
     {
      "path": "M161 55 C182 55 193 62 192 82 Q176 88 161 88Z",
      "colour": "heather"
     },
     {
      "path": "M161 40 C150 30 134 30 130 38 C134 46 150 46 161 40 C172 34 188 34 192 42 C188 50 172 46 161 40Z",
      "colour": "heather"
     }
    ],
    "lines": ["M130 82 C128 46 192 46 192 82", "M128 82 q33 12 66 0", "M161 56 C160 66 160 76 161 88", "M161 55 L161 42", "M161 40 C150 30 134 30 130 38 C134 46 150 46 161 40 C172 34 188 34 192 42 C188 50 172 46 161 40Z"]
   },
   "wizard": {
    "tiltDegrees": 5,
    "lift": 10,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M136 80 C146 58 154 38 160 30 C166 22 172 16 180 14 C176 20 174 28 172 36 C174 46 180 62 186 80 L216 80 q-56 20 -112 0 L136 80Z"],
    "spots": [
     {
      "path": "M136 80 C146 58 154 38 160 30 C166 22 172 16 180 14 C176 20 174 28 172 36 C174 46 180 62 186 80 Q161 92 136 80Z",
      "colour": "heather"
     },
     {
      "path": "M161 47 L164 55 L172 58 L164 61 L161 69 L158 61 L150 58 L158 55Z",
      "colour": "matcha"
     }
    ],
    "lines": ["M136 80 C146 58 154 38 160 30 C166 22 172 16 180 14", "M186 80 C180 62 174 46 172 36 C174 28 176 20 180 14", "M104 80 q56 20 112 0", "M161 47 L164 55 L172 58 L164 61 L161 69 L158 61 L150 58 L158 55Z"]
   },
   "hardHat": {
    "tiltDegrees": 5,
    "lift": 10,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M126 80 C125 58 138 48 153 46 Q160 41 167 46 C182 48 195 58 194 80 L210 80 q-50 17 -100 0 L126 80Z"],
    "spots": [
     {
      "path": "M126 80 C124 38 196 38 194 80 Q160 91 126 80Z",
      "colour": "matcha"
     }
    ],
    "lines": ["M126 80 C124 38 196 38 194 80", "M110 80 q50 17 100 0", "M153 86 C152 72 152 58 153 47 Q160 42 167 47 C168 58 168 72 167 86"]
   },
   "flower": {
    "tiltDegrees": 3,
    "lift": 0,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M160.1 15 Q161 14.7 161.9 15 Q162.9 15.2 163.7 16 Q164.5 16.7 165 17.7 Q165.6 18.7 166 19.8 Q166.4 20.8 166.8 21.6 Q167.1 22.5 167.5 23 Q167.9 23.5 168.5 23.8 Q169.1 24 170 24 Q170.9 24.1 172 24.1 Q173.1 24.2 174.3 24.4 Q175.4 24.7 176.4 25.2 Q177.3 25.7 177.9 26.5 Q178.4 27.3 178.4 28.3 Q178.5 29.3 178 30.3 Q177.6 31.3 176.8 32.1 Q176 33 175.1 33.7 Q174.3 34.4 173.6 35 Q172.9 35.5 172.5 36.1 Q172.1 36.6 172.1 37.3 Q172.1 37.9 172.3 38.8 Q172.6 39.7 172.8 40.7 Q173.1 41.8 173.3 43 Q173.4 44.1 173.2 45.2 Q172.9 46.3 172.4 47 Q171.8 47.8 170.8 48.1 Q169.9 48.5 168.9 48.3 Q167.8 48.2 166.7 47.7 Q165.6 47.3 164.7 46.7 Q163.8 46.1 163 45.6 Q162.3 45.1 161.6 44.9 Q161 44.7 160.4 44.9 Q159.7 45.1 159 45.6 Q158.2 46.1 157.3 46.7 Q156.4 47.3 155.3 47.7 Q154.2 48.2 153.1 48.3 Q152.1 48.5 151.2 48.1 Q150.2 47.8 149.6 47 Q149.1 46.3 148.8 45.2 Q148.6 44.1 148.7 43 Q148.9 41.8 149.2 40.7 Q149.4 39.7 149.7 38.8 Q149.9 37.9 149.9 37.3 Q149.9 36.6 149.5 36.1 Q149.1 35.5 148.4 35 Q147.7 34.4 146.9 33.7 Q146 33 145.2 32.1 Q144.4 31.3 144 30.3 Q143.5 29.3 143.6 28.3 Q143.6 27.3 144.1 26.5 Q144.7 25.7 145.6 25.2 Q146.6 24.7 147.7 24.4 Q148.9 24.2 150 24.1 Q151.1 24.1 152 24 Q152.9 24 153.5 23.8 Q154.1 23.5 154.5 23 Q154.9 22.5 155.2 21.6 Q155.6 20.8 156 19.8 Q156.4 18.7 157 17.7 Q157.5 16.7 158.3 16 Q159.1 15.2 160.1 15Z M160 68 C150 66 142 58 144 52 C152 54 160 60 160 68Z"],
    "spots": [
     {
      "path": "M160.1 15 Q161 14.7 161.9 15 Q162.9 15.2 163.7 16 Q164.5 16.7 165 17.7 Q165.6 18.7 166 19.8 Q166.4 20.8 166.8 21.6 Q167.1 22.5 167.5 23 Q167.9 23.5 168.5 23.8 Q169.1 24 170 24 Q170.9 24.1 172 24.1 Q173.1 24.2 174.3 24.4 Q175.4 24.7 176.4 25.2 Q177.3 25.7 177.9 26.5 Q178.4 27.3 178.4 28.3 Q178.5 29.3 178 30.3 Q177.6 31.3 176.8 32.1 Q176 33 175.1 33.7 Q174.3 34.4 173.6 35 Q172.9 35.5 172.5 36.1 Q172.1 36.6 172.1 37.3 Q172.1 37.9 172.3 38.8 Q172.6 39.7 172.8 40.7 Q173.1 41.8 173.3 43 Q173.4 44.1 173.2 45.2 Q172.9 46.3 172.4 47 Q171.8 47.8 170.8 48.1 Q169.9 48.5 168.9 48.3 Q167.8 48.2 166.7 47.7 Q165.6 47.3 164.7 46.7 Q163.8 46.1 163 45.6 Q162.3 45.1 161.6 44.9 Q161 44.7 160.4 44.9 Q159.7 45.1 159 45.6 Q158.2 46.1 157.3 46.7 Q156.4 47.3 155.3 47.7 Q154.2 48.2 153.1 48.3 Q152.1 48.5 151.2 48.1 Q150.2 47.8 149.6 47 Q149.1 46.3 148.8 45.2 Q148.6 44.1 148.7 43 Q148.9 41.8 149.2 40.7 Q149.4 39.7 149.7 38.8 Q149.9 37.9 149.9 37.3 Q149.9 36.6 149.5 36.1 Q149.1 35.5 148.4 35 Q147.7 34.4 146.9 33.7 Q146 33 145.2 32.1 Q144.4 31.3 144 30.3 Q143.5 29.3 143.6 28.3 Q143.6 27.3 144.1 26.5 Q144.7 25.7 145.6 25.2 Q146.6 24.7 147.7 24.4 Q148.9 24.2 150 24.1 Q151.1 24.1 152 24 Q152.9 24 153.5 23.8 Q154.1 23.5 154.5 23 Q154.9 22.5 155.2 21.6 Q155.6 20.8 156 19.8 Q156.4 18.7 157 17.7 Q157.5 16.7 158.3 16 Q159.1 15.2 160.1 15Z",
      "colour": "heather"
     },
     {
      "path": "M160 68 C150 66 142 58 144 52 C152 54 160 60 160 68Z",
      "colour": "matcha"
     }
    ],
    "lines": ["M160 78 C161 66 158 58 161 49", "M160.1 15 Q161 14.7 161.9 15 Q162.9 15.2 163.7 16 Q164.5 16.7 165 17.7 Q165.6 18.7 166 19.8 Q166.4 20.8 166.8 21.6 Q167.1 22.5 167.5 23 Q167.9 23.5 168.5 23.8 Q169.1 24 170 24 Q170.9 24.1 172 24.1 Q173.1 24.2 174.3 24.4 Q175.4 24.7 176.4 25.2 Q177.3 25.7 177.9 26.5 Q178.4 27.3 178.4 28.3 Q178.5 29.3 178 30.3 Q177.6 31.3 176.8 32.1 Q176 33 175.1 33.7 Q174.3 34.4 173.6 35 Q172.9 35.5 172.5 36.1 Q172.1 36.6 172.1 37.3 Q172.1 37.9 172.3 38.8 Q172.6 39.7 172.8 40.7 Q173.1 41.8 173.3 43 Q173.4 44.1 173.2 45.2 Q172.9 46.3 172.4 47 Q171.8 47.8 170.8 48.1 Q169.9 48.5 168.9 48.3 Q167.8 48.2 166.7 47.7 Q165.6 47.3 164.7 46.7 Q163.8 46.1 163 45.6 Q162.3 45.1 161.6 44.9 Q161 44.7 160.4 44.9 Q159.7 45.1 159 45.6 Q158.2 46.1 157.3 46.7 Q156.4 47.3 155.3 47.7 Q154.2 48.2 153.1 48.3 Q152.1 48.5 151.2 48.1 Q150.2 47.8 149.6 47 Q149.1 46.3 148.8 45.2 Q148.6 44.1 148.7 43 Q148.9 41.8 149.2 40.7 Q149.4 39.7 149.7 38.8 Q149.9 37.9 149.9 37.3 Q149.9 36.6 149.5 36.1 Q149.1 35.5 148.4 35 Q147.7 34.4 146.9 33.7 Q146 33 145.2 32.1 Q144.4 31.3 144 30.3 Q143.5 29.3 143.6 28.3 Q143.6 27.3 144.1 26.5 Q144.7 25.7 145.6 25.2 Q146.6 24.7 147.7 24.4 Q148.9 24.2 150 24.1 Q151.1 24.1 152 24 Q152.9 24 153.5 23.8 Q154.1 23.5 154.5 23 Q154.9 22.5 155.2 21.6 Q155.6 20.8 156 19.8 Q156.4 18.7 157 17.7 Q157.5 16.7 158.3 16 Q159.1 15.2 160.1 15Z", "M161 33 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0Z", "M160 68 C150 66 142 58 144 52 C152 54 160 60 160 68Z"]
   },
   "cowboy": {
    "tiltDegrees": -7,
    "lift": 12,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M137 80 C133 52 142 32 154 34 Q160 41 166 34 C178 32 187 52 183 80 C200 80 222 74 234 58 C224 86 192 94 160 94 C128 94 96 86 86 58 C98 74 120 80 137 80Z"],
    "spots": [
     {
      "path": "M137 80 C133 52 142 32 154 34 Q160 41 166 34 C178 32 187 52 183 80 Q160 84 137 80Z",
      "colour": "matcha"
     },
     {
      "path": "M86 58 C96 86 128 94 160 94 C192 94 224 86 234 58 C222 72 196 82 160 82 C124 82 98 72 86 58Z",
      "colour": "matcha"
     }
    ],
    "lines": ["M137 80 C133 52 142 32 154 34 Q160 41 166 34 C178 32 187 52 183 80", "M86 58 C96 86 128 94 160 94 C192 94 224 86 234 58", "M86 58 C98 72 124 82 160 82 C196 82 222 72 234 58", "M136 68 q24 7 48 0"]
   },
   "antenna": {
    "tiltDegrees": 6,
    "lift": 0,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": null,
    "spots": [
     {
      "path": "M164 27 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0Z",
      "colour": "heather"
     }
    ],
    "lines": ["M160 78 C160 62 156 50 162 36", "M164 27 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0Z"]
   },
   "bow": {
    "tiltDegrees": -11,
    "lift": 10,
    "floats": false,
    "onFace": false,
    "fromEars": false,
    "silhouette": ["M156 72 C140 54 120 54 120 68 C120 84 140 86 156 74Z M164 72 C180 54 200 54 200 68 C200 84 180 86 164 74Z M160 73 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0Z"],
    "spots": [
     {
      "path": "M156 72 C140 54 120 54 120 68 C120 84 140 86 156 74Z M164 72 C180 54 200 54 200 68 C200 84 180 86 164 74Z M160 73 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0Z",
      "colour": "heather"
     }
    ],
    "lines": ["M156 72 C140 54 120 54 120 68 C120 84 140 86 156 74", "M164 72 C180 54 200 54 200 68 C200 84 180 86 164 74", "M160 73 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0Z"]
   }
  }
 },
 "smallSizes": {
  "lineWeight": [[16, 22], [24, 16], [32, 13], [48, 10], [64, 9], [96, 6.5], [160, 5]],
  "eyeLineWeight": [[16, 24], [24, 19], [32, 16], [48, 13], [96, 8], [160, 6]],
  "spotSlipX": [[16, 20], [24, 16], [32, 14], [48, 12], [96, 10]],
  "spotSlipY": [[16, 16], [24, 13], [32, 11], [48, 10], [96, 8]],
  "eyeScale": [[32, 1.5], [48, 1.3], [64, 1.25], [96, 1.05], [140, 1]],
  "wobbleAbovePx": 48,
  "marksAbovePx": 48,
  "innerLineAbovePx": 40,
  "ledgeFromPx": 32,
  "eyeSpacingGrowth": 0.25,
  "eyeLineDropPerScale": 4,
  "ledgeBelowEyeLine": 38,
  "ledgeDropPerScale": 24
 },
 "colours": {
  "ink": "#141413",
  "paper": "#FAF9F5",
  "offered": [
   {
    "key": "fig",
    "hex": "#C46686"
   },
   {
    "key": "coral",
    "hex": "#EBCCCC"
   },
   {
    "key": "peach",
    "hex": "#EBC9B7"
   },
   {
    "key": "clay",
    "hex": "#D97757"
   },
   {
    "key": "pencil",
    "hex": "#F0AC54"
   },
   {
    "key": "matcha",
    "hex": "#CED6BF"
   },
   {
    "key": "mineral",
    "hex": "#629987"
   },
   {
    "key": "cloud",
    "hex": "#C5D3E0"
   },
   {
    "key": "sky",
    "hex": "#6A9BCC"
   },
   {
    "key": "heather",
    "hex": "#CBCADB"
   }
  ],
  "accessorySpots": {
   "matcha": "#CED6BF",
   "heather": "#CBCADB"
  },
  "marksFill": "#F5F4ED"
 },
 "frame": {
  "holdSettlesInSeconds": 0.35,
  "holdSettleSink": 0.012,
  "breath": {
   "swell": 0.015,
   "periodSeconds": 4
  },
  "settleRange": [-0.012, 0],
  "spin": {
   "widthSideOn": 0.92,
   "faceSlide": 46,
   "faceNarrowestShare": 0.06,
   "faceFadeStart": -0.02,
   "faceFadeOver": 0.12,
   "hatSlide": 14,
   "hatNarrowestShare": 0.55
  },
  "jumpShareWithHat": 0.7,
  "eyes": {
   "gazeLimit": 0.85,
   "gazeToUnitsX": 11,
   "gazeToUnitsY": 9,
   "drawnEyesFollowShare": 0.5,
   "browsFollowShare": 0.5,
   "openLimit": 1.3,
   "drawnAsLineBelowOpen": 0.12,
   "shutOnFaceChangeSeconds": 0.09
  },
  "hat": {
   "sinkToUnits": 89,
   "dropToUnits": 90,
   "floatsAboveBy": 12,
   "floatBob": 2.5,
   "floatBobRadiansPerSecond": 1.7
  }
 },
 "eyeKinds": {
  "oval": {
   "shutDrawnAs": {
    "overhangEachSide": 1,
    "lower": 1
   }
  },
  "lid": {
   "shutDrawnAs": {
    "overhangEachSide": 1,
    "lower": 1
   }
  }
 },
 "marksMotion": {
  "drawOn": {
   "drawnBy": 0.4,
   "heldUntil": 0.55,
   "takenBackOver": 0.4
  },
  "fadeInSeconds": 0.35,
  "modes": {
   "float": {
    "rise": 16,
    "scaleFrom": 0.7,
    "scaleGain": 0.3,
    "scaleReachedAt": 0.5
   },
   "twinkle": {
    "power": 0.7,
    "flutter": 0.12,
    "flutterTurns": 3,
    "smallest": 0.05,
    "hiddenBelow": 0.06
   },
   "ellipsis": {
    "firstAt": 0.12,
    "nextAfter": 0.22,
    "allOffAt": 0.9
   },
   "cursor": {
    "steadyMarks": 2,
    "onShare": 0.55
   },
   "firework": {
    "raysPerBurst": 8,
    "secondBurstTurnedRadians": 0.4,
    "drawnBy": 0.3,
    "takenBackFrom": 0.22,
    "takenBackOver": 0.4,
    "fly": 16
   }
  }
 },
 "line": {
  "defaults": {
   "redrawsPerSecond": 6,
   "handWobble": 6,
   "shapeDrift": 1,
   "widthWanderPercent": 26
  },
  "phases": [[0, 0, 0, 0], [1.9, 2.7, 1.3, 3.1], [3.8, 5.1, 2.9, 0.7], [5.3, 1.1, 4.6, 2.2]],
  "spotNudgeByPhase": [[0.8, -0.6], [-0.7, 0.9], [0.5, 0.7], [-0.9, -0.4]],
  "samplePathEvery": 3,
  "samplesAtMost": 360,
  "closedSamplesAtLeast": 16,
  "wander": {
   "shareOfHandWobble": 0.3,
   "wavesEvery": [170, 70],
   "wavesAtLeast": [1, 2],
   "weights": [0.65, 0.35]
  },
  "drift": {
   "shareOfShapeDrift": 0.35,
   "waveEvery": 300,
   "wavesAtLeast": 1,
   "radiansPerSecond": 0.5
  },
  "width": {
   "wavesEvery": [120, 50],
   "wavesAtLeast": [1, 2],
   "weights": [0.6, 0.4],
   "narrowest": 0.6
  },
  "shortLinesDampedBelowLength": 90,
  "taperAtOpenEnds": {
   "floor": 0.62,
   "gain": 0.38,
   "over": 7
  },
  "solidShapesWanderShare": 0.5,
  "dotBelowLength": 0.8,
  "seeds": {
   "outline": 0,
   "innerLine": 1,
   "accessoryLinesFrom": 2,
   "eyesFilled": 10,
   "eyesStroked": 11,
   "marksFrom": 20,
   "ledge": 40,
   "subPathStep": 2.1,
   "seedScale": 1.3,
   "phaseMix": [0.61, 0.43, 0.29, 0.53],
   "wanderMix": [1, 1.7],
   "driftMix": 2.3,
   "widthMix": [0.9, 1.3]
  }
 }
}`;
