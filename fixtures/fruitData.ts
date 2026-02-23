import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client/client";

export const insertFruits = async () => {
    try {
        for (const fruit of fruitData) {
            await PrismaInstance.fruit.create({
                data: fruit,
            });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des fruits -> " + (error as Error).message);
    }
};

const fruitData: Prisma.FruitCreateInput[] = [
    // Admin fruits (100)
    {
        name: "Pomme",
        description: "Fruit croquant et juteux, riche en fibres",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Banane",
        description: "Fruit tropical énergétique, riche en potassium",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Orange",
        description: "Agrume vitaminé, excellente source de vitamine C",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Fraise",
        description: "Petit fruit rouge sucré et parfumé",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Kiwi",
        description: "Fruit exotique à chair verte acidulée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Mangue",
        description: "Fruit tropical sucré à la chair onctueuse",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Raisin",
        description: "Petites baies juteuses en grappe",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Ananas",
        description: "Fruit tropical à la chair dorée et acidulée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Poire",
        description: "Fruit doux et fondant de la famille des pommes",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Cerise",
        description: "Petit fruit rouge à noyau, doux et sucré",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Abricot",
        description: "Fruit orange sucré, riche en bêta-carotène",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Pêche",
        description: "Fruit juicy et sucré à chair tendre",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Nectarine",
        description: "Variété de pêche à peau lisse",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Prune",
        description: "Petit fruit violet sucré et charnu",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Citron",
        description: "Agrume acide, riche en vitamine C",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Lime",
        description: "Petite variété de citron très acidulée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Pamplemousse",
        description: "Agrume volumineux légèrement amer",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Mûre",
        description: "Petite baie noire sucrée en grappe",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Myrtille",
        description: "Minuscule baie bleu-noir, saveur acidulée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Framboise",
        description: "Petite baie rouge délicate et sucrée",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Cassis", description: "Baie noire à saveur intense", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Groseille",
        description: "Petites baies rouges ou blanches en grappe",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Grenade",
        description: "Fruit rouge volumineux rempli de grains juteux",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Papaye",
        description: "Fruit tropical sucré à chair orange tendre",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Goyave",
        description: "Fruit tropical parfumé à chair rose ou blanche",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Passion",
        description: "Petit fruit tropical à pulpe acidulée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Noix de coco",
        description: "Fruit blanc laiteux riche en fibres",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Datte",
        description: "Petit fruit sucré riche en minéraux",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Figue", description: "Fruit sucré à pulpe charnue", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Raisin sec",
        description: "Raisin déshydraté très sucré",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Baobab",
        description: "Fruit africain riche en vitamine C",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Carambole",
        description: "Fruit exotique jaune à saveur aigre-douce",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Longane",
        description: "Petit fruit asiatique sucré à coque fine",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Litchi",
        description: "Petit fruit exotique blanc délicat",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Ramboutan",
        description: "Fruit exotique chevelu à chair translucide",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Mangoustan",
        description: "Fruit exotique à chair blanche acidulée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Durian",
        description: "Fruit exotique à odeur prononcée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Jacquier",
        description: "Fruit géant tropical à chair fibreuse",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Rambai", description: "Fruit asiatique jaune sucré", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Jujube",
        description: "Petit fruit asiatique rougeâtre",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Kiwano",
        description: "Fruit exotique vert à pépins gélatineux",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Sapote",
        description: "Fruit tropical à chair jaune onctueuse",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Cherimoya",
        description: "Fruit sucré à chair crémeuse",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Fruit de la passion",
        description: "Fruit pourpre à pulpe acidulée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Physalis",
        description: "Petite baie orange sous enveloppe papier",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Feijoa",
        description: "Petit fruit vert à saveur subtile",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Nefle du Japon",
        description: "Petit fruit orange à chair juteuse",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Azérole", description: "Petite pomme rouge acidulée", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Amande",
        description: "Fruit sec blanc riche en protéines",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Noix",
        description: "Fruit sec blanc nutritif et énergétique",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Noisette",
        description: "Petit fruit sec marron très savoureux",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Pistache", description: "Fruit sec vert naturel", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Châtaigne",
        description: "Fruit sec marron riche en amidon",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Cacahuète",
        description: "Légumineuse souterraine comestible",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Cacao",
        description: "Fruit contenant les fèves de chocolat",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Baie de goji",
        description: "Petite baie rouge énergétique",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Cranberry",
        description: "Baie rouge acidulée riche en antioxydants",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Açaï",
        description: "Baie pourpre amazonienne très nutritive",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Guarana",
        description: "Baie énergétique riche en caféine",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Baie de schizandra",
        description: "Baie adaptogène aux 5 saveurs",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Cloudberry",
        description: "Baie scandinave dorée délicate",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Argousier",
        description: "Petite baie orange riche en vitamines",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Ashwagandha",
        description: "Baie ayurvédique adaptogène",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Plantain", description: "Grosse banane verte à cuire", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Banane rouge",
        description: "Variété de banane violet rougeâtre",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Pomme verte",
        description: "Variété acidulée de pomme",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Pomme rouge",
        description: "Variété sucrée et croquante",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Pomme jaune",
        description: "Variété équilibrée sucré-acide",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Poire Williams",
        description: "Variété juteuse et sucrée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Poire Conférence",
        description: "Variété fine et parfumée",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Pêche blanche", description: "Variété blanche douce", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Pêche jaune",
        description: "Variété classique juteuse",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Raisin blanc", description: "Variété claire sucrée", User: { connect: { email: "admin@example.com" } } },
    { name: "Raisin noir", description: "Variété foncée intense", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Raisin rouge",
        description: "Variété sucrée équilibrée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Orange sanguine",
        description: "Variété avec pulpe rouge",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Orange navel",
        description: "Variété sans pépins douce",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Orange maltaise",
        description: "Variété blond-rouge sucrée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Framboise noire",
        description: "Variété noire intense",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Framboise dorée", description: "Variété jaune rare", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Cerise bigarreau",
        description: "Variété ferme juteux",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Cerise griottier",
        description: "Variété acide ancienne",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Prune reine-claude",
        description: "Variété verte classique",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Prune mirabelle",
        description: "Minuscule prune jaune sucrée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Prune quetsche",
        description: "Variété bleue pour confitures",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Abricot bergeron",
        description: "Variété succulente française",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Abricot orangé",
        description: "Variété précoce intense",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Melon charentais",
        description: "Melon réticulé sucré",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Melon honeydew",
        description: "Melon blanc-vert onctueux",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Pastèque", description: "Fruit d'été rouge aqueux", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Pastèque jaune",
        description: "Variété rare jaune succulente",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Fraise mara",
        description: "Variété haute qualité intense",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Fraise ciflorette",
        description: "Variété remontante généreuse",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Cassis noir",
        description: "Variété classique profonde",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Groseille verte",
        description: "Variété aigre pour confitures",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Mûre sauvage",
        description: "Variété naturelle robuste",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Myrtille sauvage",
        description: "Variété minuscule intense",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Kiwi jaune", description: "Variété succulente douce", User: { connect: { email: "admin@example.com" } } },
    { name: "Kiwi or", description: "Variété tropicale sucrée", User: { connect: { email: "admin@example.com" } } },
    { name: "Figue noire", description: "Variété précoce sucrée", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Figue blanche",
        description: "Variété claire délicate",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Mangue alphonso", description: "Variété roi de Inde", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Mangue kent",
        description: "Variété sans fibres douces",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Noix de macadamia",
        description: "Noix tendre riche huile",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Pépin raisin blanc",
        description: "Variété sans pépins sucrée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Raisin muscat",
        description: "Variété parfumée intense",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Datte deglet noor",
        description: "Variété ambrée sucrée",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Datte medjool",
        description: "Variété charnue onctueuse",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Baie de sureau",
        description: "Baie pourpre médicinale",
        User: { connect: { email: "admin@example.com" } },
    },
    { name: "Baie rose", description: "Épice poivrée délicate", User: { connect: { email: "admin@example.com" } } },
    { name: "Coing", description: "Fruit jaune à cuire parfumé", User: { connect: { email: "admin@example.com" } } },
    {
        name: "Cornouille",
        description: "Petit fruit rouge acidulé oublié",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Nèfle",
        description: "Fruit brun mou après blettissement",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Arbouse",
        description: "Petite baie rouge granuleuse méditerranéenne",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Sureau rouge",
        description: "Baie rouge claire toxique crue",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Prunelle",
        description: "Petite baie bleu-noir très astringente",
        User: { connect: { email: "admin@example.com" } },
    },
    {
        name: "Alise",
        description: "Fruit de l'alisier, brun et farineux",
        User: { connect: { email: "admin@example.com" } },
    },

    // User fruits (100)
    {
        name: "Pomme Granny",
        description: "Variété très acidulée croquante",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Pomme Fuji",
        description: "Variété ultra sucrée japonaise",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Pomme Gala", description: "Variété équilibrée dorée", User: { connect: { email: "user@example.com" } } },
    {
        name: "Pomme Braeburn",
        description: "Variété croquante sucrée",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Pomme Honeycrisp",
        description: "Variété très juteuse croquante",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Pomme Pink Lady",
        description: "Variété rose acidulée fine",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Pomme Jonagold",
        description: "Variété dorée équilibrée",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Banane plantain",
        description: "Banane verte à cuire savoureuse",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Clémentine",
        description: "Petite mandarine sans pépins douce",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Mandarine", description: "Agrume doux facile à peler", User: { connect: { email: "user@example.com" } } },
    {
        name: "Tangérine",
        description: "Variété orange foncée sucrée",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Satsuma", description: "Variété très sucrée japonaise", User: { connect: { email: "user@example.com" } } },
    { name: "Pomelo", description: "Agrume volumineux sucré tendre", User: { connect: { email: "user@example.com" } } },
    {
        name: "Cédrat",
        description: "Agrume citronné à zeste parfumé",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Bergamote",
        description: "Agrume parfumé utilisé en thé",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Yuzu", description: "Agrume japonais acide intense", User: { connect: { email: "user@example.com" } } },
    { name: "Combava", description: "Agrume indien aromatique", User: { connect: { email: "user@example.com" } } },
    {
        name: "Pomelo rose",
        description: "Variété rose sucrée délicate",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Rambutan rouge",
        description: "Variété classique sucrée",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Mangoustan pourpre",
        description: "Variété intense délicate",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Papaye jaune", description: "Variété standard sucrée", User: { connect: { email: "user@example.com" } } },
    { name: "Papaye rouge", description: "Variété charnue intense", User: { connect: { email: "user@example.com" } } },
    { name: "Goyave rose", description: "Variété chair rose sucrée", User: { connect: { email: "user@example.com" } } },
    {
        name: "Goyave blanche",
        description: "Variété chair blanche délicate",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Fruit du dragon rose",
        description: "Fruit exotique magenta sucré",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Fruit du dragon blanc",
        description: "Variété blanche délicate",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Cherimoya géante",
        description: "Variété haute qualité crémeuse",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Granadille",
        description: "Fruit passion jaune intense",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Naranja agria",
        description: "Agrume acide rafraîchissant",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Pomme cannelle",
        description: "Fruit tropical sucré parfumé",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Fruit de la passion maracuja",
        description: "Variété jaune sucrée",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Tamarin", description: "Gousse acide épicée asiatique", User: { connect: { email: "user@example.com" } } },
    {
        name: "Raisins de Corinthe",
        description: "Raisin très sec sucré",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Raisins de Smyrne",
        description: "Raisin sec très sucré",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Sultanine", description: "Raisin sec doré sans pépins", User: { connect: { email: "user@example.com" } } },
    { name: "Malabar", description: "Raisin sec blanc délicat", User: { connect: { email: "user@example.com" } } },
    {
        name: "Figue de barbarie",
        description: "Fruit épineux chair rose sucrée",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Jujube rouge",
        description: "Baie asiatique sucrée croquante",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Sapote noir",
        description: "Fruit tropical chair marron",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Avocat",
        description: "Fruit vert riche en matière grasse",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Cacaoyer", description: "Fruit contenant fèves cacao", User: { connect: { email: "user@example.com" } } },
    {
        name: "Théier camelia",
        description: "Feuilles comestibles thé",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Vanille planifolia",
        description: "Orchidée gousses parfumées",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Muscade",
        description: "Graine épice aromatique intense",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Poivre noir", description: "Baie épice piquante", User: { connect: { email: "user@example.com" } } },
    { name: "Cannelier", description: "Écorce épice sucrée", User: { connect: { email: "user@example.com" } } },
    { name: "Girofle", description: "Bouton épice aromatique", User: { connect: { email: "user@example.com" } } },
    { name: "Badiane", description: "Fruit étoilé épice anisée", User: { connect: { email: "user@example.com" } } },
    {
        name: "Cardamome",
        description: "Graine épice parfumée intense",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Curcuma", description: "Rhizome épice dorée amère", User: { connect: { email: "user@example.com" } } },
    { name: "Amla", description: "Baie indienne riche vitamine C", User: { connect: { email: "user@example.com" } } },
    {
        name: "Baie de maqui",
        description: "Baie chilienne antioxydant",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Açaí noir",
        description: "Baie amazonienne très nutritive",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Baie de falsa",
        description: "Baie indienne sucrée délicate",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Baie d'aronia",
        description: "Baie noire très antioxydant",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Airelle",
        description: "Baie rouge acidulée médicinale",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Baie de genévrier",
        description: "Baie noire épicée aromatique",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Baie de sureau noir",
        description: "Baie pourpre riche antioxydants",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Baie d'épine-vinette",
        description: "Baie rouge acidulée",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Baie de houx",
        description: "Baie rouge toxique décoration",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Baie de mûrier blanc",
        description: "Baie blanche sucrée",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Baie de mûrier noir", description: "Baie noire sucrée", User: { connect: { email: "user@example.com" } } },
    {
        name: "Baie d'églantier",
        description: "Baie rouge riche vitamine C",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Baie de poivrier rose",
        description: "Baie rose légèrement épicée",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Baie de cèdre",
        description: "Baie brune aromatique résineuse",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Baie de genêt", description: "Graine comestible rare", User: { connect: { email: "user@example.com" } } },
    { name: "Merisier", description: "Petite cerise sauvage aigre", User: { connect: { email: "user@example.com" } } },
    {
        name: "Aubépine",
        description: "Baie rouge médicinale cardiaque",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Baie de cornouiller",
        description: "Baie rouge acidulée",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Baie de troène", description: "Baie pourpre-noire", User: { connect: { email: "user@example.com" } } },
    {
        name: "Baie de lierre",
        description: "Baie noire légèrement toxique",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Noix de ginkgo",
        description: "Graine aromatique amère",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Châtaigne d'eau",
        description: "Fruit blanc croquant aquatique",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Graine de courge",
        description: "Graine comestible nutritive",
        User: { connect: { email: "user@example.com" } },
    },
    { name: "Pépita maïs", description: "Graine de maïs comestible", User: { connect: { email: "user@example.com" } } },
    {
        name: "Graine de melon",
        description: "Graine nutritive saveur neutre",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Pépins de pastèque",
        description: "Graine comestible nutritive",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Kumquat",
        description: "Petit agrume ovale à croquer entier",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Main de Bouddha",
        description: "Agrume exotique en forme de doigts",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Salak",
        description: "Fruit à peau de serpent indonésien",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Camu-camu",
        description: "Baie amazonienne ultra riche en vitamine C",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Lucuma",
        description: "Fruit péruvien sucré à chair farineuse",
        User: { connect: { email: "user@example.com" } },
    },
    {
        name: "Cupuaçu",
        description: "Cousin du cacao à pulpe crémeuse",
        User: { connect: { email: "user@example.com" } },
    },
];
