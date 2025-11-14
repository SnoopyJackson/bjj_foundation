"""
BJJ Video Classification Script
Reads bjj_videos_simple.json and classifies videos based on BJJ terminology
Outputs to bjj_simple_processed.json with classification field
"""

import json
import re
from typing import Dict, List, Set


# BJJ Classification Categories with keywords (English + French)
BJJ_GLOSSARY = {
    # --- CORE GUARDS ---
    "closed_guard": [
        "closed guard", "closed-guard", "full guard", "classic guard", "closed guards", "closed guard:",
        "garde fermée", "garde fermee", "garde classique", "garde fermé", "Closed Guard"
    ],
    "open_guard": [
        "open guard", "open-guard",
        "garde ouverte", "open guards"
    ],
    "half_guard": [
        "half guard", "half-guard", "halfguard",
        "demi-garde", "demi garde", "half garde", "half guards"
    ],
    "z_guard": [
        "z guard", "z-guard", "knee shield", "knee-shield",
        "garde z", "bouclier de genou", "z guards", "z-guards","knee shields"
    ],
    "deep_half_guard": [
        "deep half", "deep-half", "deep half guard", "deep-half guard","deep half guards"
        "demi-garde profonde", "demi garde profonde", "deep half garde"
    ],

    # --- BUTTERFLY & VARIANTS ---
    "butterfly_guard": [
        "butterfly guard", "butterfly-guard", "butterfly",
        "garde papillon", "papillon", "butterfly guards"
    ],
    "seated_guard": [
        "seated guard", "seated-guard", "sit-up guard", "sit up guard",
        "garde assise", "garde assis", "garde en position assise", "garde en position assis", "sit-up guards"
    ],

    # --- DE LA RIVA FAMILY ---
    "de_la_riva": [
        "de la riva", "dlr", "de lariva guard", "delariva", "outside de la riva",
        "garde de la riva", "de la riva garde"
    ],
    "deep_de_la_riva": [
        "deep de la riva", "deep dlr", "deep de lariva guard", "deep delariva", "deep outside de la riva",
        "garde de la riva profonde", "de la riva x", "de la riva-x", "dlr profond", "deep de la riva garde", "dlrx"
    ],
    "reverse_de_la_riva": [
        "reverse de la riva", "rdlr", "reverse dlr", "inside de la riva",
        "de la riva inversée", "de la riva inverse", "dlr inversé"
    ],

    # --- SPIDER / LASSO / LEG LASSO ---
    "spider_guard": [
        "spider guard", "spider-guard", "foot-on-bicep", "spider", "spider guards",
        "garde araignée", "garde araignee", "araignée", "araignee"
    ],
    "lasso_guard": [
        "lasso guard", "lasso-guard", "lasso", "leg lasso",
        "garde lasso"
    ],
    "double_lasso": [
        "double lasso", "double-lasso guard",
        "double lasso", "lasso double"
    ],

    # --- X-GUARD FAMILY ---
    "x_guard": [
        "x guard", "x-guard",
        "garde x", "x guards"
    ],
    "single_leg_x": [
        "single leg x", "slx", "single-leg x", "ashi garami", "ashi",
        "garde x jambe unique", "x jambe simple"
    ],
    "50_50_guard": [
        "50/50", "50-50", "fifty fifty", "5050",
        "cinquante cinquante"
    ],
    "inside_senko": [
        "inside senko", "senko", "senko guard",
        "garde senko"
    ],

    # --- LAPEL & MODERN GUARDS ---
    "worm_guard": [
        "worm guard", "worm-guard", "worm guards",
        "garde ver", "garde worm", "garde revers"
    ],
    "reverse_worm_guard": [
        "reverse worm guard", "reverse worm", "rwg",
        "garde ver inversée", "garde ver inverse", "worm inversé"
    ],
    "squid_guard": [
        "squid guard", "squid-guard", "squid guards",
        "garde pieuvre", "garde calmar"
    ],
    "ringworm_guard": [
        "ringworm guard", "ringworm-guard",
        "garde teigne"
    ],
    "clamp_guard": ["clamp guard", "clamp-guard"],
    "lapel_guard": [
        "lapel guard", "lapel-guard", "lapel control",
        "garde revers", "contrôle du revers", "controle du revers"
    ],
    "lapel_lasso": [
        "lapel lasso", "lapel-lasso",
        "lasso de revers", "lasso revers"
    ],
    "gubber_guard": [
        "gubber guard", "gubber-guard",
        "garde gubber"
    ],

    # --- INVERTED & HYBRID GUARDS ---
    "inverted_guard": [
        "inverted guard", "inverted-guard", "upside down guard",
        "garde inversée", "garde inverse", "garde renversée", "garde renverse"
    ],
    "k_guard": [
        "k guard", "k-guard", "kay guard",
        "garde k", "k guards", "k-guards"
    ],
    "matrix_guard": [
        "matrix guard", "matrix-guard", "matrix"
        "garde matrix", "garde matrice", "matrice", "matrix guards"
    ],
    "berimbolo_position": [
        "berimbolo", "bolo", "bolo position",
        "berimbolo", "position berimbolo", "berimbolos"
    ],

    # --- LAPEL + DEEP GUARD MIXES ---
    "worm_x_guard": [
        "worm x", "worm-x guard", "worm-x",
        "garde worm x", "x ver"
    ],
    "lapel_x_guard": [
        "lapel x", "lapel-x", "lapel-x guard",
        "garde x revers", "x de revers"
    ],

    # --- SPECIAL / NICHE GUARDS ---
    "rubber_guard": [
        "rubber guard", "rubber-guard", "mission control", "chill dog", "new york", "kung fu move",
        "garde caoutchouc", "garde élastique", "garde elastique", "garde rubber", "rubber guards"
    ],
    "reverse_closed_guard": [
        "reverse closed guard", "reverse closed-guard", "inverted closed guard",
        "garde fermée inversée", "garde fermee inverse"
    ],
    "low_guard": [
        "low guard", "low-guard", "lazy guard",
        "garde basse"
    ],
    "shin_shin_guard": [
        "shin shin guard", "shin-shin", "shin guard",
        "garde shin shin", "garde tibia"
    ],
    "half_butterfly_guard": [
        "half butterfly", "half-butterfly", "half butterfly guard",
        "demi papillon", "demi-papillon", "half papillon"
    ],
    "panda_guard": [
        "panda guard", "panda position",
        "garde panda", "position panda"
    ],
    # "body_lock_guard": [
    #     "body lock guard", "bodylock guard",
    #     "garde verrouillage corps", "garde body lock"
    # ],
    "donkey_guard": [
        "donkey guard", "donkey-guard",
        "garde âne", "garde ane"
    ],
    "crucifix" : ["crucifix"],
    "truck" : ["truck", "trucks"],
    "collar_sleeve_guard": ["collar sleeve guard", "collar-sleeve guard",
        "garde col manche", "collar-sleeve", "collar sleeve", "col manche", "collar & sleeve", "collar and sleeve"],
    "crab_ride": [
        "crab ride", "crab-ride",
        "crab ride", "crabe", "crab rides"
    ],
    "octopus_guard": ["octopus", "pieuvre"],
    # Positions
    "mount": [
        "mount", "mounted", "mounts",
        "montée", "monte", "position montée", "position monte"
    ],
    "back_control": [
        "back control", "back mount", "back take", "taking the back", "rear mount",
        "contrôle du dos", "controle du dos", "prise de dos", "dos pris", "back takes"
    ],
    "side_control": [
        "side control", "side-control", "crossbody", "cross body",
        "contrôle latéral", "controle lateral", "côté", "cote", "side controls", "control en croix"
    ],
    "north_south": [
        "north south", "north-south", "north/south",
        "nord sud", "nord-sud"
    ],
    "knee_on_belly": [
        "knee on belly", "knee-on-belly", "kob",
        "genou sur ventre", "genou au ventre"
    ],
    "turtle": [
        "turtle position", "turtle guard", "turtle",
        "tortue", "position tortue", "garde tortue"
    ],
    #    "truck_position": [
    #     "truck", "truck position", "banana split position",
    #     "position camion", "camion", "banane"
    # ],
      "kesa_gatame": [
        "kesa gatame", "scarf hold", "scarf position",
        "kesa gatame", "contrôle écharpe", "controle echarpe"
    ],
    "yoga": ["yoga", "yogaforbjj"],
    "drill" : ["drill", "drills"],
    "workout" : ["workout", "weightlifting", "exercise", "weight lift", "workouts"],
    "mantis_guard": ["mantis guard", "mantis-guard"],
    "rat_guard": ["rat guard", "rat-guard"],
    "high_guard": ["high guard", "high-guard"],
    "vice_guard": ["vice guard", "vice-guard"],
    "tarantula_guard": ["tarantula guard", "tarantula-guard"],
    "lockdown": ["lockdown", "lock-down"],
    "80_20_guard": ["80/20 guard", "80-20 guard", "eighty twenty guard", "80 20", "80/20"],
    "90_10_guard": ["90/10 guard", "90-10 guard", "ninety ten guard"],
    "quarter_guard": ["quarter guard", "quarter-guard"],
    "coyote_guard": ["coyote guard", "coyote-guard"],
    "waiter_guard": ["waiter guard", "waiter-guard"],
    # Passes
     # --- General / Core ---
    "guard_pass": [
        "guard pass", "passing guard", "pass the guard", "guard passing", "pass guard",
        "passage de garde", "passer la garde", "passement", "pass", "passes"
    ],
    "pressure_pass": [
        "pressure pass", "smash pass", "pressure passing", "smashing pass",
        "passage en pression", "pression", "écrasement", "ecrasement"
    ],
    "speed_pass": [
        "speed pass", "quick pass", "dynamic passing",
        "passage rapide", "passage dynamique"
    ],

    # --- Classic Fundamental Passes ---
    "knee_slice": [
        "knee slice", "knee-slice", "knee cut", "knee-cut", "knee slide", "knee slide pass",
        "tranche de genou", "coupe genou", "passage genou"
    ],
    "toreando": [
        "toreando", "toreando pass", "bullfighter", "bullfighter pass", "matsutomi pass",
        "torero", "passage torero"
    ],
    "leg_drag": [
        "leg drag", "leg-drag", "leg drag pass",
        "traînée de jambe", "trainee de jambe", "drag de jambe"
    ],
    "over_under": [
        "over under", "over-under", "over/under", "over under pass",
        "dessus dessous", "dessus-dessous"
    ],
    "stack_pass": [
        "stack pass", "stack-pass", "stacking", "stacking pass",
        "passage empilé", "passage empile", "empilement"
    ],
    "double_under": [
        "double under", "double-under", "double under pass", "double underhooks pass",
        "double crochet sous", "double dessous"
    ],

    # --- Smash / Pressure Variants ---
    "headquarters_pass": [
        "headquarters", "headquarters position", "headquarters pass",
        "quartier général", "quartier general", "qg"
    ],
    "smash_pass": [
        "smash pass", "pressure smash", "half guard smash", "smash passing",
        "passage écrasement", "passage ecrasement", "smash"
    ],
    "body_lock_pass": [
         "body lock pass", "bodylock pass",
        "verrouillage corps", "passage body lock"
    ],
    "cross_face_pass": [
        "cross face pass", "cross-face pass",
        "passage cross face", "croisé visage", "croise visage"
    ],
    "staple_pass": [
        "staple pass", "stapling pass", "leg staple",
        "passage agrafe", "agrafage"
    ],

    # --- Standing / Mobility-Based Passes ---
    "long_step": [
        "long step", "long-step", "long step pass",
        "long pas", "grande enjambée", "grande enjambee"
    ],
    "x_pass": [
        "x pass", "x-pass", "x style pass",
        "passage x"
    ],
    # "knee_cut_pass": [
    #     "knee cut", "knee-cut pass", "knee cut pass",
    #     "coupe genou", "tranche genou"
    # ],
    "leg_weave_pass": [
        "leg weave", "leg-weave", "leg weave pass",
        "tissage jambe", "passage tissage"
    ],
    "kicking_pass": [
        "kicking pass", "kick pass", "leg kick pass",
        "passage coup de pied", "kick pass"
    ],
    "back_step_pass": [
        "back step", "back-step", "back step pass",
        "pas arrière", "pas arriere", "passage arrière", "passage arriere"
    ],
    "shuffle_pass": [
        "shuffle pass", "side shuffle pass",
        "passage shuffle", "passage mélangé", "passage melange"
    ],

    # --- Lapel & Gi-Specific Passes ---
    "lapel_pass": [
        "lapel pass", "lapel passing", "lapel trap pass",
        "passage revers", "passement revers"
    ],
    "worm_pass": [
        "worm pass", "worm guard pass",
        "passage ver", "passage worm"
    ],
    "lapel_toreando": [
        "lapel toreando", "lapel bullfighter", "lapel drag pass",
        "toreando revers", "torero revers"
    ],

    # --- Half Guard Specific ---
    "knee_torque_pass": [
        "knee torque", "knee twist pass",
        "torsion genou", "passage torsion"
    ],
    "flatten_pass": [
        "flatten pass", "flatten out pass",
        "passage aplatissement", "aplatir"
    ],
    "weave_pass": [
        "weave pass", "weaving pass", "shoulder weave pass",
        "passage tissage", "tissage épaule", "tissage epaule"
    ],

    # # --- Additional Passes ---
    # "knee_slide_pass": [
    #     "knee slide", "knee-slide pass", "knee slide pass",
    #     "glissement genou", "passage glissement"
    # ],
    # "over_under_pass": [
    #     "over under pass", "over-under pass", "over under",
    #     "passage dessus dessous", "dessus-dessous"
    # ],
    # "half_guard_backstep": [
    #     "half guard backstep", "backstep from half guard",
    #     "pas arrière demi garde", "pas arriere demi garde"
    # ],

    # --- Specialty / Modern ---
    "float_pass": [
        "float pass", "floating pass", "balance pass",
        "passage flottant", "flottement"
    ],
    "hip_switch_pass": [
        "hip switch pass", "switch base pass", "reverse knee cut",
        "passage changement de hanche", "switch hanche"
    ],
    "tripod_pass": [
        "tripod pass", "tripod"
    ],
    "under_over_pass": [
        "under over pass", "under-over pass"
    ],
    "cartwheel_pass": [
        "cartwheel pass", "cartwheel"
    ],
    "crazy_dog_pass": ["crazy dog", "crazy-dog"]    ,
    # --- Standing / Takedown / Clinch Positions ---
    "takedown": [
        "takedown", "take down", "takedowns", "shoot", "double leg", "double-leg", "single leg", "single-leg",
        "projection", "amené au sol", "amene au sol", "amenée", "amenee", "takedowns", "throws", "throw"
    ],
    "double_leg": [
        "double leg takedown", "double-leg takedown", "double leg",
        "double jambe", "projection double jambe", "morote gari"
    ],
    "single_leg": [
        "single leg takedown", "single-leg takedown", "single leg",
        "simple jambe", "jambe simple", "projection jambe simple"
    ],
    "ankle_pick": [
        "ankle pick", "ankle-pick",
        "saisie cheville", "attaque cheville"
    ],
    "high_crotch": [
        "high crotch", "high-crotch",
        "high crotch", "fourche haute"
    ],
    "body_lock_takedown": [
        "body lock takedown", "bodylock takedown",
        "projection verrouillage corps", "body lock projection"
    ],
    "osoto_gari": [
        "osoto gari", "osoto-gari", "osoto",
        "osoto gari", "grand fauchage extérieur", "grand fauchage exterieur"
    ],
    "ouchi_gari": [
        "ouchi gari", "ouchi-gari", "ouchi",
        "ouchi gari", "grand fauchage intérieur", "grand fauchage interieur"
    ],
    "seoi_nage": [
        "seoi nage", "seoi-nage", "seoi",
        "seoi nage", "projection épaule", "projection epaule"
    ],
    "foot_sweep": [
        "foot sweep", "foot-sweep", "sweep to takedown", "sasae", "ashi barai",
        "balayage pied", "ashi barai", "sasae"
    ],
    "duck_under": [
        "duck under", "duck-under"
    ],
    "snap_down": [
        "snap down", "snap-down"
    ],
    "fireman_carry": [
        "fireman carry", "fireman-carry", "fireman's carry", "fireman's-carry", "fireman",
    ],
    "outside_trip": [
        "outside trip", "outside-trip"
    ],
    "inside_trip": [
        "inside trip", "inside-trip"
    ],
    "uchi_mata": [
        "uchi mata", "uchi-mata"
    ],
    "tomoe_nage": [
        "tomoe nage", "tomoe-nage"
    ],
    "imanari_roll": [
        "imanari roll", "imanari-roll", "imanari"
    ],
    "scissor_takedown": [
        "scissor takedown", "scissor-takedown", "scissors takedown", "scissor takedown"
    ],
    "hip_toss": [
        "hip toss", "hip-toss", "hip throw", "ogoshi"
    ],
    "collar_drag": [
        "collar drag", "collar-drag", "collar drag takedown"
    ],
    "arm_drag": [
        "arm drag", "arm-drag", "arm drag takedown", "arm drag throw"
    ],
    "suplex": [
        "suplex"
    ],
    "russian_tie": [
        "russian tie", "russian-tie"   
    ],

    # --- Standup as a guard-type (captures standing position and guard-pull, NOT specific takedowns) ---
    "standup_guard": [
        "standup guard", "stand up guard", "stand-up guard", "standing guard",
        "guard pull", "pull guard", "pull-to-guard", "pull to guard", "guard-pull",
        "pulling guard", "guard pulling", "tirer la garde", "tirer garde", "jump to guard", "jump guard"
    ],

    # --- Stand up / Clinch concepts ---
    "stand_up": [
        "stand up", "standing up", "stand-up", "stand up guard", "standing position"
    ],
    "clinch": [
        "clinch", "clinch work", "clinch position", "over-under", "underhook"
    ],

    # --- Defensive / Recovery-Related (still “passing” contexts) ---
    "guard_recovery": [
        "guard recovery", "regard", "recover guard", "retention"
    ],
    "anti_berimbolo_pass": [
        "anti berimbolo", "berimbolo defense", "bolo counter"
    ],
    "leg_pummel_pass": [
        "leg pummel pass", "leg pummeling"
    ],
    
      # --- General ---
    "sweep": [
        "sweep", "sweeping", "reversal", "guard sweep", "sweeps", "sweepes"
        "balayage", "renversement", "retournement"
    ],

    # --- Classic Closed Guard Sweeps ---
    "scissor_sweep": [
        "scissor sweep", "scissor-sweep", "scissors sweep"
        "balayage ciseau", "ciseau"
    ],
    "hip_bump": [
        "hip bump", "hip-bump", "sit up sweep", "sit-up sweep",
        "balayage hanche", "bump de hanche"
    ],
    "flower_sweep": [
        "flower sweep", "flower-sweep", "pendulum sweep",
        "balayage fleur"
    ],
    "balloon_sweep": [
        "balloon sweep", "balloon-sweep", "helicopter sweep",
        "balayage ballon", "hélicoptère", "helicoptere"
    ],
    "double_ankle_sweep": [
        "double ankle sweep", "ankle grab sweep", "ankle sweep",
        "balayage double cheville", "balayage chevilles"
    ],
    "elevator_sweep": [
        "elevator sweep", "elevator hook", "hook sweep",
        "balayage ascenseur", "élévateur", "elevateur"
    ],
    "hook_sweep": [
        "hook sweep", "hooking sweep",
        "balayage crochet"
    ],
    "lumberjack_sweep": [
        "lumberjack sweep", "underhook sweep", "open guard sweep",
        "balayage bûcheron", "balayage bucheron"
    ],
    "muscle_sweep": [
        "muscle sweep", "muscle-sweep"],
    # --- Butterfly / Seated Guard Sweeps ---
    "butterfly_sweep": [
        "butterfly sweep", "butterfly hook sweep", "basic butterfly",
        "balayage papillon", "sweep papillon"
    ],
    "arm_drag_sweep": [
        "arm drag sweep", "arm-drag sweep", "arm drag to sweep",
        "balayage arm drag", "traînée de bras", "trainee de bras"
    ],
    # "reverse_butterfly_sweep": [
    #     "reverse butterfly sweep", "reverse hook sweep",
    #     "balayage papillon inversé", "papillon inverse"
    # ],
    "shoulder_crunch_sweep": [
        "shoulder crunch sweep", "over under butterfly sweep",
        "balayage épaule", "balayage epaule"
    ],
    # "elevator_butterfly_sweep": [
    #     "elevator butterfly sweep", "elevator hook sweep",
    #     "balayage papillon ascenseur"
    # ],

    # --- Half Guard & Z Guard Sweeps ---
    "old_school_sweep": [
        "old school sweep", "half guard sweep", "half-guard old school",
        "balayage old school", "balayage vieille école", "balayage vieille ecole"
    ],
    "plan_b_sweep": [
        "plan b sweep", "plan-b sweep",
        "balayage plan b"
    ],
    # "electric_chair_sweep": [
    #     "electric chair sweep", "electric chair",
    #     "chaise électrique", "chaise electrique", "balayage chaise électrique", "balayage chaise electrique"
    # ],
    "waiter_sweep": [
        "waiter sweep", "deep half waiter sweep",
        "balayage serveur", "balayage garçon", "balayage garcon"
    ],
    # "homer_simpson_sweep": [
    #     "homer simpson sweep", "homer sweep", "forward roll sweep",
    #     "balayage homer simpson", "balayage homer", "rouleau avant"
    # ],
    "shaolin_sweep": [
        "shaolin sweep", "shaolin half guard sweep",
        "balayage shaolin"
    ],

    # --- De La Riva / Reverse DLR / Open Guard Sweeps ---
    "berimbolo_sweep": [
        "berimbolo sweep", "bolo sweep", "berimbolo reversal",
        "balayage berimbolo", "renversement berimbolo"
    ],
    "tripod_sweep": [
        "tripod sweep", "tripod-sweep",
        "balayage trépied", "balayage trepied"
    ],
    "sickle_sweep": [
        "sickle sweep", "sickle-sweep", "tripod combo"
    ],
    # "de_la_riva_sweep": [
    #     "de la riva sweep", "dlr sweep"
    # ],
    # "reverse_de_la_riva_sweep": [
    #     "reverse de la riva sweep", "rdlr sweep"
    # ],
    # "hook_trip_sweep": [
    #     "hook trip sweep", "foot trip sweep"
    # ],
    # "sit_up_guard_sweep": [
    #     "sit up guard sweep", "sit-up guard sweep"
    # ],
    "dummy_sweep": ["dummy sweep", "dummy_sweep"],
    # --- X Guard / Single-Leg X Sweeps ---
    # "x_guard_sweep": [
    #     "x guard sweep", "x-guard sweep"
    # ],
    # "single_leg_x_sweep": [
    #     "single leg x sweep", "slx sweep", "ashi sweep"
    # ],
    "technical_standup_sweep": [
        "technical stand up sweep", "tech stand up sweep", "base sweep"
    ],
    # "shin_shin_sweep": [
    #     "shin shin sweep", "shin-to-shin sweep", "shin guard sweep"
    # ],

    # # --- Spider / Lasso / Lapel Sweeps ---
    # "spider_sweep": [
    #     "spider sweep", "spider guard sweep"
    # ],
    # "lasso_sweep": [
    #     "lasso sweep", "lasso guard sweep"
    # ],
    # "omoplata_sweep": [
    #     "omoplata sweep", "shoulder lock sweep"
    # ],
    # "lapel_sweep": [
    #     "lapel sweep", "lapel guard sweep", "lapel drag sweep"
    # ],
    # "worm_sweep": [
    #     "worm sweep", "worm guard sweep"
    # ],
    # "squid_sweep": [
    #     "squid sweep", "squid guard sweep"
    # ],
    # "ringworm_sweep": [
    #     "ringworm sweep", "ringworm guard sweep"
    # ],

    # --- Modern / Advanced Variations ---
    "kiss_of_the_dragon": [
        "kiss of the dragon", "kiss of dragon sweep"
    ],
    "matrix_sweep": [
        "matrix sweep", "matrix inversion sweep", "matrix", "matrice"
    ],
    "baby_bolo_sweep": [
        "baby bolo", "baby bolo sweep"
    ],
    "helicopter_sweep": [
        "helicopter sweep", "aerial sweep"
    ],
    "meregali_sweep": [
        "meregali sweep"],
    "pendulum_sweep": [
        "pendulum sweep"],
        "dogfight": [
        "dogfight", "dog fight"],
        "john_wayne_sweep": ["john wayne sweep", "john-wayne sweep", "john wayne"],
    "overhead_sweep": [
        "overhead sweep", "overhead throw sweep"],
        "wrestle_up": ["wrestle up", "wrestle-up sweep", "wrestleup"]
    # "tornado_sweep": [
    #     "tornado sweep", "inverted tornado sweep"
    # ],
    # "berimbolo_reversal": [
    #     "berimbolo reversal", "bolo reversal"
    # # ],
    # "somersault_sweep": [
    #     "somersault sweep", "forward roll sweep"
    # ],
    # "half_butterfly_sweep": [
    #     "half butterfly sweep", "half-butterfly sweep"
    # ],
    # "knee_shield_sweep": [
    #     "knee shield sweep", "z guard sweep"
    # ],

    # # --- Leg Entanglement / Modern No-Gi Sweeps ---
    # "ashi_sweep": [
    #     "ashi sweep", "ashi garami sweep"
    # ],
    # "inside_senko_sweep": [
    #     "inside senko sweep", "senko sweep"
    # ],
    # "k_guard_sweep": [
    #     "k guard sweep", "k-guard sweep"
    # ],
    # "50_50_sweep": [
    #     "50/50 sweep", "fifty fifty sweep", "5050 sweep"
    # ],
    # "leg_pummel_sweep": [
    #     "leg pummel sweep", "pummel to sweep"
    # ],
    
    # Submissions
   # --- Armlocks & Shoulder Locks ---
    ,"armbar": [
        "armbar", "arm bar", "juji gatame", "straight armbar", "arm lock", "arm-lock", "armlock"
    ],
    "kimura": [
        "kimura"
    ],
    "americana": [
        "americana", "key lock", "ude garami"
    ],
    "omoplata": [
        "omoplata", "shoulder lock from guard", "shoulder submission", "omoplate"
    ],
    "straight_arm_lock": [
        "straight arm lock", "straight armlock", "arm crush"
    ],
    "mir_lock": [
        "mir lock", "mirror lock"
    ],
    "hammerlock": [
        "hammerlock", "chicken wing"
    ],
    "wristlock": [
        "wristlock", "wrist lock", "poignet", "wristlocks", "clé de poignet", "cle de poignet"
    ],
    "flying_armbar": [
        "flying armbar", "flying-armbar", "jumping armbar"
    ],
    
    # --- Chokes (Blood & Air) ---
    "rear_naked_choke": [
        "rear naked choke", "rnc", "rear-naked", "mata leao","etranglement arrière", "étranglement arrière", "etranglement arriere"
    ],
    "scissor_choke": ["scissor choke", "scissor-choke", "kiri jime", "scissors choke"],
    "flying_triangle": [
        "flying triangle", "flying-triangle", "jumping triangle"
    ],
    "flying_guillotine": ["flying guillotine", "flying-guillotine", "jumping guillotine"],
    "triangle": [
        "triangle choke", "triangle", "sankaku", "triangle submission"
    ],
    "arm_triangle": [
        "arm triangle", "kata gatame", "head and arm choke", "arm head choke", "bras tête", "bras tete"
    ],
    "anaconda": [
        "anaconda", "anaconda choke"
    ],
    "darce": [
        "darce", "d'arce", "darce choke"
    ],
    "ezekiel": [
        "ezekiel", "ezekiel choke", "sode guruma jime"
    ],
    "guillotine": [
        "guillotine", "guillotine choke", "front choke"
    ],
    "marcelotine": [
        "marcelotine", "high elbow guillotine", "marcelo guillotine"
    ],
    "hindulotine": [
        "hindulotine", "hindu guillotine", "hindu choke"],
    "loop_choke": [
        "loop choke", "loop-choke"
    ],
    "baseball_choke": [
        "baseball choke", "baseball-choke", "baseball bat choke"
    ],
    "bow_and_arrow": [
        "bow and arrow", "bow-and-arrow", "bow and arrow choke", "arc et flèche", "arc-et-flèche", "arc et fleche", "bow & arrow"
    ],
    "cross_collar_choke": [
        "cross collar choke", "cross-collar choke", "x choke", "juji jime"
    ],
    "paper_cutter": [
        "paper cutter", "paper-cutter choke", "cross-face choke"
    ],
    "north_south_choke": [
        "north south choke", "north-south choke"
    ],
    "clock_choke": [
        "clock choke", "clock-choke"
    ],
    "peruvian_necktie": [
        "peruvian necktie", "necktie choke"
    ],
    "gogoplata": [
        "gogoplata", "gogo choke", "shin choke"
    ],
    "lapel_choke": [
        "lapel choke", "lapel submission", "lapel strangle"
    ],
    "brabo_choke": [
        "brabo choke", "brabo", "darce variation"
    ],
    "smother_choke": [
        "smother choke", "face choke", "air choke"
    ],
    "choi_bar": [
        "choi bar", "choi-bar", "choi bar", "choibar"],
    "mother_milk": [
        "mother milk", "mother milk choke"],

    # --- Leg Locks ---
    "heel_hook": [
        "heel hook", "heel-hook", "inverted heel hook", "outside heel hook", "inside heel hook", "heelhook",
        "clé de talon", "cle de talon"
    ],
    "toe_hold": [
        "toe hold", "toe-hold", "fig-four toe hold"
    ],
    "kneebar": [
        "kneebar", "knee bar", "hiza juji gatame", "knee lock", "knee-lock", "clé de genou", "cle de genou"
    ],
    "ankle_lock": [
        "ankle lock", "ankle-lock", "achilles lock", "straight ankle", "ashi lock", "clé de cheville", "cle de cheville"
    ],
    "calf_slicer": [
        "calf slicer", "calf-slicer", "calf crusher", "knee slicer"
    ],
    "bicep_slicer": [
        "bicep slicer", "bicep-slicer", "bicep crusher"
    ],
    "honey_hole": [ # move to guard or position
        "inside sankaku", "411", "saddle", "triangle leg lock"
    ],
    "outside_ashi_lock": [ # move to guard or position
        "outside ashi lock", "cross ashi lock", "outside ashi garami"
    ],
    "banana_split": [
        "banana split", "splits submission", "banana-split"
    ],
    # "kneebar_50_50": [
    #     "50/50 kneebar", "fifty fifty kneebar", "5050 kneebar"
    # ],

    # --- Neck Cranks & Spinal Locks ---
    "neck_crank": [
        "neck crank", "neck-crank", "cervical crank"
    ],
    "can_opener": [
        "can opener", "neck opener", "neck stretch"
    ],
    "twister": [
        "twister", "spinal lock", "guillotine twister"
    ],
    "fly_trap": [
        "fly trap", "fly-trap"],
    # --- Compression / Crush Submissions ---
    "arm_crush": [
        "arm crush", "arm compression lock"
    ],
    "shoulder_crush": [
        "shoulder crush", "shoulder compression"
    ],
    "leg_compression": [
        "leg compression", "leg crush"
    ],

    # --- Rare / Position-Specific Submissions ---
    "mounted_triangle": [
        "mounted triangle", "mount triangle choke"
    ],
    # "triangle_armbar": [
    #     "triangle armbar", "armbar from triangle"
    # ],
    "reverse_triangle": [
        "reverse triangle", "reverse sankaku"
    ],
    # "no_gi_choke": [
    #     "no gi choke", "no-gi choke", "gi-less choke"
    # ],
    "buggy_choke": [
        "buggy choke", "buggy choke submission"
    ],
    "dead_orchard": [
        "dead orchard", "dead orchard choke"],
        "z-lock": [
        "z-lock", "z lock submission"],
    "baratoplata": [
        "baratoplata", "barato plata"],
            "tarikoplata": [
        "tarikoplata", "tariko plata"],
    # Techniques/Concepts
    "takedown": [
        "takedown", "take down", "throw","projection"
    ],
    "escape": [
        "escape", "escaping", "sortie"
    ],
    "reversal": [
        "reversal", "reversing"
    ],
    "transition": [
        "transition", "transitioning"
    ],
    "defense": [
        "defense", "defend", "defending"
    ],
    "attack": [
        "attack", "attacking"
    ],
    "counter": [
        "counter", "countering"
    ],
    "grip": [
        "grip", "gripping", "grip fighting"
    ],
    "berimbolo": [
        "berimbolo", "bolo"
    ],
    "leg_lock": [
        "leg lock", "leg-lock", "leg attack", "leg locks", "leg attacks", "leg submissions", "leg submission", "clé de jambe", "cle de jambe"
    ],
    "back_attack": [
        "back attack", "back-attack"
    ],
    "shoulder_lock": [
        "shoulder lock", "shoulder-lock", "shoulder attacks", "shoulder submission", "shoulder submissions"
    ],
    "neck_crank": [
        "neck crank", "neck-crank", "can opener"
    ],
"estima_lock": ["estima loclk", "estima-lock"],
"aoki_lock" : ["aoki lock"],
"japanese_necktie" : ["japanese necktie"],
"von_flue_choke" : ["vonflue choke", "von flue choke"],
"electric_chair" : ["eletric chair"]
}

# Emoji mappings for guard types
GUARD_EMOJIS = {
"closed_guard": "🔒",
"open_guard": "🌊",
"half_guard": "⚖️",
"butterfly_guard": "🦋",
"de_la_riva": "🪝",
"reverse_de_la_riva": "🔄",
"deep_half_guard": "🕳️",
"seated_guard": "🪑",
"spider_guard": "🕷️",
"lasso_guard": "🪢",
"double_lasso": "➰",
"x_guard": "❌",
"single_leg_x": "🦵",
"50_50_guard": "⚔️",
"z_guard": "⚡",
"reverse_closed_guard": "🔐",
"inside_senko": "🦶",
"reverse_worm_guard": "↩️",
"squid_guard": "🦑",
"ringworm_guard": "⭕️",
"rubber_guard": "🤸",
"lapel_guard": "🧵",
"lapel_lasso": "𓍯",
"gubber_guard": "🛡️",
"inverted_guard": "🔁",
"worm_guard": "🪱",
"matrix_guard": "🧩",
"berimbolo_position": "🌀",
"worm_x_guard": "🐛",
"lapel_x_guard": "🎗️",
"low_guard": "⬇️",
"shin_shin_guard": "🦿",
"half_butterfly_guard": "🎀",
"panda_guard": "🐼",
"body_lock_guard": "🤼",
"donkey_guard": "🐴",
"k_guard": "🅺",
"standup_guard": "🥋",
"truck": "🚚",
"williams_guard": "🎽",
"crab_ride": "🦀",
"octopus_guard": "🐙",
"honey_hole": "🍯",
"crucifix": "✝️",
"collar_sleeve_guard": "👔",
"yoga": "🧘", 
"drill": "🔥",
"workout": "💪",
"mantis_guard": "🦗",
"rat_guard": "🐀",
"deep_de_la_riva" : "⚓",
"high_guard": "🏔️",
"vice_guard": "𝐕",
"tarantula_guard": "🕸️",
"lockdown": "🔑",
"80_20_guard": "8️⃣",
"90_10_guard": "9️⃣",
"quarter_guard": "¼",
"coyote_guard": "🐺",
"waiter_guard": "🍽️",
"clamp_guard": "🗜️"
}

# Emoji for standup guard
# GUARD_EMOJIS["standup_guard"] = "🥋"

# Category groupings for better organization
CATEGORY_GROUPS = {
    "guard_type": [
"closed_guard",
"open_guard",
"half_guard",
"z_guard",
"deep_half_guard",
"butterfly_guard",
"seated_guard",
"de_la_riva",
"reverse_de_la_riva",
"spider_guard",
"lasso_guard",
"double_lasso",
"x_guard",
"single_leg_x",
"50_50_guard",
"inside_senko",
"worm_guard",
"worm_x_guard",
"reverse_worm_guard",
"squid_guard",
"ringworm_guard",
"deep_de_la_riva",
"lapel_guard",
"lapel_x_guard",
"lapel_lasso",
"gubber_guard",
"inverted_guard",
"k_guard",
"matrix_guard",
"berimbolo_position",
"rubber_guard",
"reverse_closed_guard",
"shin_shin_guard",
"half_butterfly_guard",
"donkey_guard",
"truck",
"crucifix",
"collar_sleeve_guard",
"crab_ride",
"octopus_guard"
     , "standup_guard",
     "yoga", 
     "drill",
     "workout",
     "mantis_guard","rat_guard","high_guard","vice_guard","tarantula_guard",
     "lockdown",
"80_20_guard","quarter_guard","coyote_guard","waiter_guard", "clamp_guard"
    ],
    "position": [
        "mount", "back_control", "side_control", "north_south", 
        "knee_on_belly", "turtle"
    ],
    "pass": [
"guard_pass",
"pressure_pass",
"speed_pass",
"knee_slice",
"toreando",
"leg_drag",
"over_under",
"stack_pass",
"double_under",
"headquarters_pass",
"smash_pass",
"body_lock_pass",
"cross_face_pass",
"staple_pass",
"long_step",
"x_pass",
"leg_weave_pass",
"kicking_pass",
"back_step_pass",
"shuffle_pass",
"lapel_pass",
"worm_pass",
"knee_torque_pass",
"flatten_pass",
"weave_pass",
"float_pass",
"hip_switch_pass",
"tripod_pass",
"under_over_pass",
"cartwheel_pass",
"crazy_dog_pass"
    ],
    "sweep": [
        "sweep",
"scissor_sweep",
"hip_bump",
"flower_sweep",
"balloon_sweep",
"double_ankle_sweep",
"elevator_sweep",
"hook_sweep",
"lumberjack_sweep",
"shoulder_crunch_sweep",
"old_school_sweep",
"plan_b_sweep",
"waiter_sweep",
"shaolin_sweep",
"berimbolo_sweep",
"tripod_sweep",
"sickle_sweep",
"kiss_of_the_dragon",
"matrix_sweep",
"baby_bolo_sweep",
"helicopter_sweep",
"pendulum_sweep",
"dogfight",
"john_wayne_sweep",
"overhead_sweep",
"meregali_weep",
"wrestle_up",
"muscle_sweep",
"dummy_sweep",
"technical_standup_sweep"
    ],
    "submission": [
"armbar",
"kimura",
"americana",
"omoplata",
'tarikoplata',
"straight_arm_lock",
"mir_lock",
"wristlock",
"rear_naked_choke",
"scissor_choke",
"triangle",
"arm_triangle",
"anaconda",
"darce",
"ezekiel",
"guillotine",
"marcelotine",
"hindulotine",
"loop_choke",
"baseball_choke",
"bow_and_arrow",
"cross_collar_choke",
"paper_cutter",
"north_south_choke",
"clock_choke",
"peruvian_necktie",
"gogoplata",
"lapel_choke",
"brabo_choke",
"smother_choke",
"mother_milk",
"heel_hook",
"toe_hold",
"kneebar",
"ankle_lock",
"calf_slicer",
"bicep_slicer",
"banana_split",
"neck_crank",
"can_opener",
"twister",
"fly_trap",
"arm_crush",
"shoulder_crush",
"leg_compression",
"mounted_triangle",
"reverse_triangle",
"buggy_choke",
"dead_orchard",
"z-lock",
"baratoplata",
"estima_lock",
"aoki_lock",
"japanese_necktie",
"von_flue_choke",
"electric_chair",
"flying_triangle",
"flying_guillotine",
"flying_armbar",
"choi_bar"
    ],
    "takedown": [
        "takedown",
"double_leg",
"single_leg",
"ankle_pick",
"high_crotch",
"body_lock_takedown",
"snap_down",
"arm_drag",
"collar_drag",
"fireman_carry",
"duck_under",
"suplex",
"russian_tie",
"outside_trip",
"inside_trip",
"osoto_gari",
"ouchi_gari",
"seoi_nage",
"foot_sweep",
"uchi_mata",
"tomoe_nage",
"imanari_roll",
"scissor_takedown",
"hip_toss"



    ],
    "technique": [
        "escape", "reversal", "transition", "defense",
        "attack", "counter", "grip"
        "back_attack", "clinch"
    ]
}


def normalize_text(text: str) -> str:
    """Normalize text for comparison"""
    if not text:
        return ""
    return text.lower().strip()


def classify_video(title: str, description: str = '', tags: List[str] = None) -> Dict[str, List[str]]:
    """
    Classify a video based on title, description (optional), and tags (optional)
    Returns a dict with classification categories and their matched terms
    Uses priority matching to handle overlapping terms (e.g., "single leg x" vs "single leg")
    """
    # Handle optional parameters
    if tags is None:
        tags = []
    if description is None:
        description = ''
    
    # Combine all text sources
    combined_text = normalize_text(f"{title} {description} {' '.join(tags)}")
    
    classifications = {
        "guard_type": [],
        "position": [],
        "pass": [],
        "sweep": [],
        "submission": [],
        "technique": [],
        "takedown": []
    }
    
    matched_terms = set()
    
    # Create a priority list - check more specific terms first
    # This prevents "single leg" from matching before "single leg x"
    term_priority = []
    
    # Calculate priority based on keyword length (longer = more specific = higher priority)
    for term, keywords in BJJ_GLOSSARY.items():
        max_keyword_length = max(len(kw) for kw in keywords)
        term_priority.append((max_keyword_length, term, keywords))
    
    # Sort by length (descending) - check longest/most specific terms first
    term_priority.sort(reverse=True, key=lambda x: x[0])
    
    # Track which parts of the text have been matched to avoid double-matching
    matched_positions = set()
    
    # Check each classification category in priority order
    for _, term, keywords in term_priority:
        if term in matched_terms:
            continue
            
        for keyword in keywords:
            # Use word boundaries to avoid partial matches
            pattern = r'\b' + re.escape(keyword.lower()) + r'\b'
            matches = re.finditer(pattern, combined_text)
            
            for match in matches:
                start, end = match.span()
                # Check if this text span has already been matched by a more specific term
                overlap = any((start < pos2 and end > pos) 
                             for pos, pos2 in matched_positions)
                
                if not overlap:
                    matched_terms.add(term)
                    matched_positions.add((start, end))
                    break
            
            if term in matched_terms:
                break
    
    # Organize matched terms into categories
    for category, terms in CATEGORY_GROUPS.items():
        for term in terms:
            if term in matched_terms:
                # Convert underscore to space and title case for readability
                formatted_term = term.replace("_", " ").title()
                
                # Add emoji for guard types
                if category == "guard_type" and term in GUARD_EMOJIS:
                    formatted_term = f"{GUARD_EMOJIS[term]} {formatted_term}"
                
                classifications[category].append(formatted_term)
    
    # Remove empty categories
    classifications = {k: v for k, v in classifications.items() if v}
    
    return classifications


def process_bjj_videos(input_file: str = 'bjj_videos_simple.json', 
                       output_file: str = 'bjj_simple_processed.json'):
    """
    Read BJJ videos from JSON, classify them, and write to new JSON file
    """
    try:
        # Read input file
        print(f"Reading {input_file}...")
        with open(input_file, 'r', encoding='utf-8') as f:
            videos = json.load(f)
        
        print(f"Processing {len(videos)} videos...")
        
        # Process each video
        processed_videos = []
        stats = {
            "total": len(videos),
            "classified": 0,
            "unclassified": 0
        }
        
        for idx, video in enumerate(videos, 1):
            # Get video details
            title = video.get('title', '')
            description = video.get('description', '')
            tags = video.get('tags', [])
            
            # Classify video (use title, description and tags)
            classification = classify_video(title)
            
            # Add classification to video
            video['classification'] = classification
            
            # Update stats
            if classification:
                stats['classified'] += 1
            else:
                stats['unclassified'] += 1
            
            processed_videos.append(video)
            
            # Print progress
            if idx % 10 == 0 or idx == len(videos):
                print(f"  Processed {idx}/{len(videos)} videos...")
        
        # Write output file
        print(f"\nWriting results to {output_file}...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(processed_videos, f, indent=2, ensure_ascii=False)
        
        # Print statistics
        print("\n" + "="*60)
        print("Classification Complete!")
        print("="*60)
        print(f"Total videos: {stats['total']}")
        print(f"Classified: {stats['classified']}")
        print(f"Unclassified: {stats['unclassified']}")
        print(f"\nOutput saved to: {output_file}")
        print("="*60)
        
        # Show some examples
        print("\nSample classifications:")
        print("-"*60)
        for i, video in enumerate(processed_videos[:5]):
            if video['classification']:
                print(f"\n{i+1}. {video['title'][:60]}...")
                for category, terms in video['classification'].items():
                    print(f"   {category}: {', '.join(terms)}")
        
        return processed_videos
        
    except FileNotFoundError:
        print(f"Error: Could not find file '{input_file}'")
        print("Make sure bjj_videos_simple.json exists in the current directory")
        return None
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in '{input_file}': {e}")
        return None
    except Exception as e:
        print(f"Error processing videos: {e}")
        return None


def main():
    """Main execution function"""
    print("BJJ Video Classification Script")
    print("="*60)
    
    # Process videos
    result = process_bjj_videos()
    
    if result:
        print("\n✓ Classification completed successfully!")
    else:
        print("\n✗ Classification failed!")


if __name__ == '__main__':
    main()
