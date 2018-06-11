/**
 * Created by Caleb Milligan on 4/20/2016.
 */

function shuffle(array) {
    var index = array.length, temp, rand_index;
    while (0 !== index) {
        rand_index = Math.floor(Math.random() * index);
        index -= 1;
        temp = array[index];
        array[index] = array[rand_index];
        array[rand_index] = temp;
    }
    return array;
}

/*
 * TODO: Items
 */
function Item(id, name, matcher, is_food, damage, max_durability, durability, heal_value, can_pick_up, original, description, enter_text, exit_text) {
    this.id = id;
    this.name = name;
    this.matcher = matcher;
    this.is_food = is_food;
    this.damage = damage || 0;
    this.max_durability = max_durability || 0;
    this.durability = durability || max_durability;
    this.heal_value = heal_value || 0;
    this.can_pick_up = can_pick_up;
    this.description = description;
    if (original) {
        Item.ITEMS[id] = this;
    }
    this.enter_text = enter_text;
    this.exit_text = exit_text;
}
Item.ITEMS = [];
Item.prototype.id = -1;
Item.prototype.is_food = false;
Item.prototype.description = undefined;
Item.prototype.name = undefined;
Item.prototype.matcher = undefined;
Item.prototype.can_pick_up = true;
Item.prototype.damage = 2;
Item.prototype.max_durability = 0;
Item.prototype.durability = 0;
Item.prototype.heal_value = 0;
Item.prototype.enter_text = undefined;
Item.prototype.exit_text = undefined;
Item.prototype.clone = function () {
    return new Item(this.id, this.name, this.matcher, this.is_food, this.damage, this.max_durability, this.durability, this.heal_value, this.can_pick_up, false, this.description, this.enter_text, this.exit_text);
};
Item.prototype.equals = function (other) {
    return other.id == this.id
        && other.damage == this.damage
        && other.max_durability == this.max_durability
        && other.durability == this.durability
        && other.heal_value == this.heal_value
        && other.can_pick_up == this.can_pick_up;
};
Item.prototype.toString = function () {
    var txt = this.name;
    if (!this.can_pick_up || this.damage > 0 || this.heal_value > 0 || this.max_durability > 0) {
        txt += " (";
    }
    if (this.can_pick_up) {
        if (this.damage > 0) {
            txt += "attack: " + this.damage + "hp";
        }
        if (this.heal_value > 0) {
            if (this.damage > 0) {
                txt += ", ";
            }
            txt += "heal: " + this.heal_value + "hp";
        }
        if (this.max_durability > 0) {
            if (this.damage > 0 || this.heal_value > 0) {
                txt += ", ";
            }
            txt += "durability: " + (Math.round(((this.durability / this.max_durability) * 1000.0)) / 10.0) + "%";
        }
    }
    else {
        txt += "structure";
        if (this.max_durability > 0) {
            txt += ", durability: " + (Math.round(((this.durability / this.max_durability) * 1000.0)) / 10.0) + "%";
        }
    }
    if (!this.can_pick_up || this.damage > 0 || this.heal_value > 0 || this.max_durability > 0) {
        txt += ")";
    }
    return txt;
};

Item.STONE_HOUSE = new Item(0, "Stone house", /^(stone(\s+)(house|shelter|cabin|hut))$/i, false, 30, 256, 256, 0, false, true, "a sturdy shelter made of stone.", "You enter the stone house.", "You exit the stone house.");
Item.WOODEN_HOUSE = new Item(1, "Wooden house", /^(wood(en)?(\s+)(house|shelter|cabin|hut))$/i, false, 20, 128, 128, 0, false, true, "a sturdy shelter made of wood.", "You enter the wooden house.", "You exit the wooden house.");
Item.MUD_HOUSE = new Item(2, "Mud house", /^(((earth(en)?)|mud|dirt)(\s+)(house|shelter|cabin|hut))$/i, false, 10, 64, 64, 0, false, true, "a flimsy shelter made of clumped mud.", "You enter the mud house.", "You exit the mud house.");
Item.CAVE = new Item(3, "Cave", /^(cave(rn)?)$/i, false, 0, 0, 0, 0, false, true, "a damp cave. You can't see to the back of it.", "You cautiously make your way into the cave.", "You exit the cave, blinded by the sunlight.");
Item.ABANDONED_CABIN = new Item(4, "Abandoned cabin", /^((abandoned(\s+))?(house|cabin))$/i, false, 0, 256, 256, 0, false, true, "an old, dilapidated cabin, abandoned long ago.", "You enter the cabin, stirring up a cloud of dust.", "You exit the cabin, glad to be free of the musty odor.");
Item.BOULDER = new Item(5, "Boulder", /^(boulder(s)?)$/i, false, 0, 0, 0, 0, false, true, "a large boulder. There's a space under it you could crawl into.", "You shimmy under the boulder.", "You crawl out from under the boulder, covered in dirt.");
Item.STONE = new Item(6, "Stone", /^((stone|rock)(s)?)$/i, false, 5, 64, 64, 0, true, true, "A big ol' rock. Good for building.");
Item.STICK = new Item(7, "Stick", /^(((stick|twig)(s)?)|(branch(es)?))$/i, false, 5, 16, 16, 0, true, true, "A sturdy stick, fresh from the ground.");
Item.MUD = new Item(8, "Mud", /^(earth|mud|dirt)$/i, false, 0, 0, 0, 0, true, true, "A clump of mud. Not suitable for facials.");
Item.FLINT = new Item(9, "Flint", /^flint$/i, false, 8, 8, 8, 0, true, true, "A sharp piece of flint. Good for tools and weapons.");
Item.GRASS = new Item(10, "Grass", /^grass$/i, false, 0, 0, 0, 0, true, true, "A clump of fibrous grasses. Used for mortar and bindings.");
Item.MORTAR = new Item(11, "Mortar", /^(mortar|cement)$/i, false, 0, 0, 0, 0, true, true, "Wet mortar used for building sturdy structures.");
Item.FLINT_BLADE = new Item(12, "Flint blade", /^(flint(\s+)blade)$/i, false, 12, 16, 16, 0, true, true, "A sharpened piece of flint.");
Item.FLINT_KNIFE = new Item(13, "Flint knife", /^(flint(\s+)knife)$/i, false, 20, 32, 32, 0, true, true, "A crude, but sharp, flint knife.");
Item.TWINE = new Item(14, "Twine", /^(twine|string)$/i, false, 0, 0, 0, 0, true, true, "Strong, stiff twine.");
Item.ROPE = new Item(15, "Rope", /^rope$/i, false, 0, 0, 0, 0, true, true, "Thick, strong rope.");
Item.HANDLE = new Item(16, "Handle", /^(handle|hilt)$/i, false, 5, 32, 32, 0, true, true, "A handle wrapped with twine. Perfect for tools and weapons.");
Item.STONE_CLUB = new Item(17, "Stone club", /^(stone(\s+)club)$/i, false, 15, 32, 32, 0, true, true, "A heavy stone club.");
Item.STAFF = new Item(18, "Staff", /^staff$/i, false, 10, 16, 16, 0, true, true, "A long staff. You're tempted to spin it around shouting \"TRAITOR!\"");
Item.LANCE = new Item(19, "Lance", /^(lance|spear)$/i, false, 25, 32, 32, 0, true, true, "A long staff with a blade affixed to the end.");
Item.BERRIES = new Item(20, "Berries", /^(berr(y|ies))$/i, true, 0, 0, 0, 5, true, true, "Suspicious berries.");
Item.BERRY_SALAD = new Item(21, "Berry salad", /^(berry(\s+)salad)$/i, true, 0, 0, 0, 7, true, true, "A mixture of berries and grass. Not very appetizing.");
Item.BERRY_PASTE = new Item(22, "Berry paste", /^(berry(\s+)paste)$/i, false, 0, 0, 0, 15, true, true, "A thick paste made from berries. Superb healing qualities.");
Item.LEATHER = new Item(23, "Leather", /^(hide|leather)$/i, false, 0, 0, 0, 0, true, true, "Sun-cured leather.");
Item.RAW_MEAT = new Item(24, "Raw meat", /^((raw|uncooked)(\s+)meat)$/i, true, 0, 0, 0, 5, true, true, "A slab of raw, dripping meat.");
Item.RAW_FIBER = new Item(25, "Raw fiber", /^((raw|crude)(\s+)fiber)$/i, false, 0, 0, 0, 0, true, true, "A clump of thin plant fibers.");
Item.CLOTH = new Item(26, "Cloth", /^(cloth|fabric)$/i, false, 0, 0, 0, 0, true, true, "Coarse cloth made from plant fibers.");
Item.TORCH = new Item(27, "Torch", /^torch$/i, false, 15, 32, 32, 0, true, true, "A flaming torch. Source of light and heat.");
Item.CAMPFIRE = new Item(28, "Campfire", /^(((camp(\s*))?fire)((\s*)pit)?)$/i, false, 0, 0, 0, 0, true, true, "A roaring fire. Very cheerful.");
Item.COOKED_MEAT = new Item(29, "Cooked meat", /^(cooked(\s+)meat)$/i, true, 0, 0, 0, 25, true, true, "Hot, juicy food.");
Item.BANDAGE = new Item(30, "Bandage", /^bandage$/i, false, 0, 0, 0, 50, true, true, "A strip of cloth covered in healing paste.");

/*
 * TODO: Crafting
 */
function Recipe(result, result_quantity, item_1, quantity_1, consume_1, item_2, quantity_2, consume_2) {
    Recipe.recipes.push(this);
    this.result = result.clone();
    this.result_quantity = result_quantity || 0;
    this.discovered = false;
    this.item_1 = item_1.clone();
    this.consume_1 = consume_1;
    this.quantity_1 = quantity_1 || 0;
    this.item_2 = (item_2 ? item_2.clone() : undefined);
    this.quantity_2 = quantity_2 || 0;
    this.consume_2 = consume_2;
}
Recipe.recipes = [];
Recipe.prototype.discovered = false;
Recipe.prototype.item_1 = undefined;
Recipe.prototype.quantity_1 = undefined;
Recipe.prototype.consume_1 = undefined;
Recipe.prototype.item_2 = undefined;
Recipe.prototype.quantity_2 = undefined;
Recipe.prototype.consume_2 = undefined;
Recipe.prototype.result = undefined;
Recipe.prototype.result_quantity = undefined;
Recipe.prototype.canCraft = function (rpg, inventory) {
    var i1q = 0;
    var i2q = 0;
    for (var i = 0; i < inventory.items.length; i++) {
        var item = inventory.items[i];
        if (item.id == this.item_1.id) {
            i1q++;
        }
        else if (this.item_2 && item.id == this.item_2.id) {
            i2q++;
        }
    }
    if (i1q >= this.quantity_1 && (!this.item_2 || i2q >= this.quantity_2)) {
        return true;
    }
    var txt = "You need ";
    var on = false;
    if (this.quantity_1 > i1q) {
        on = true;
        txt += (this.quantity_1 - i1q) + " " + this.item_1.name;
    }
    if (this.item_2 && this.quantity_2 > i2q) {
        if (on) {
            txt += " and ";
        }
        txt += (this.quantity_2 - i2q) + " " + this.item_2.name;
    }
    rpg.output(txt);
    return false;
};
Recipe.prototype.toString = function () {
    var txt = this.quantity_1 + " " + this.item_1.name;
    if (this.item_2) {
        txt += " + " + this.quantity_2 + " " + this.item_2.name;
    }
    txt += " = " + this.result_quantity + " " + this.result.name;
    if (!this.consume_1) {
        txt += " + " + this.quantity_1 + " " + this.item_1.name;
    }
    if (this.item_2 && !this.consume_2) {
        txt += " + " + this.quantity_2 + " " + this.item_2.name;
    }
    return txt;
};
Recipe.prototype.craft = function (rpg, inventory) {
    if (!this.canCraft(rpg, inventory)) {
        return false;
    }
    if (this.consume_1) {
        for (var i = 0; i < this.quantity_1; i++) {
            inventory.removeItemById(this.item_1.id);
        }
    }
    if (this.consume_2 && this.item_2) {
        for (i = 0; i < this.quantity_2; i++) {
            inventory.removeItemById(this.item_2.id);
        }
    }
    rpg.output("You crafted " + this.result_quantity + " " + this.result.toString());
    for (i = 0; i < this.result_quantity; i++) {
        inventory.addItem(this.result.clone());
    }
    return true;
};

new Recipe(Item.MORTAR, 2, Item.MUD, 1, true, Item.GRASS, 2, true);
new Recipe(Item.MUD_HOUSE, 1, Item.MORTAR, 10, true);
new Recipe(Item.WOODEN_HOUSE, 1, Item.STICK, 10, true, Item.MORTAR, 10, true);
new Recipe(Item.STONE_HOUSE, 1, Item.STONE, 10, true, Item.MORTAR, 10, true);
new Recipe(Item.FLINT_BLADE, 1, Item.FLINT, 1, true, Item.STONE, 1, false);
new Recipe(Item.TWINE, 1, Item.GRASS, 4, true);
new Recipe(Item.ROPE, 1, Item.TWINE, 4, true);
new Recipe(Item.HANDLE, 1, Item.STICK, 1, true, Item.TWINE, 1, true);
new Recipe(Item.FLINT_KNIFE, 1, Item.FLINT_BLADE, 1, true, Item.HANDLE, 1, true);
new Recipe(Item.STONE_CLUB, 1, Item.STONE, 2, true, Item.HANDLE, 1, true);
new Recipe(Item.STAFF, 1, Item.HANDLE, 2, true, Item.TWINE, 1, true);
new Recipe(Item.LANCE, 1, Item.STAFF, 1, true, Item.FLINT_BLADE, 1, true);
new Recipe(Item.BERRY_SALAD, 1, Item.BERRIES, 2, true, Item.GRASS, 2, true);
new Recipe(Item.BERRY_PASTE, 1, Item.BERRY_SALAD, 1, true, Item.STONE, 1, false);
new Recipe(Item.RAW_FIBER, 3, Item.GRASS, 1, true, Item.FLINT_KNIFE, 1, false);
new Recipe(Item.CLOTH, 1, Item.RAW_FIBER, 9, true, Item.STONE, 1, false);
new Recipe(Item.TORCH, 1, Item.CLOTH, 1, true, Item.STICK, 1, true);
new Recipe(Item.CAMPFIRE, 1, Item.TORCH, 3, true, Item.STONE, 8, true);
new Recipe(Item.COOKED_MEAT, 1, Item.RAW_MEAT, 1, true, Item.CAMPFIRE, 1, false);
new Recipe(Item.BANDAGE, 1, Item.CLOTH, 2, true, Item.BERRY_PASTE, 1, true);

/*
 * TODO: Inventory
 */
function Inventory(items) {
    this.items = items || [];
}
Inventory.prototype.items = [];
Inventory.prototype.addItem = function (item) {
    this.items.push(item);
};
Inventory.prototype.hasItemById = function (id) {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id && this.items[i].can_pick_up) {
            return true;
        }
    }
    return false;
};
Inventory.prototype.getCountById = function (id) {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id && this.items[i].can_pick_up) {
            count++;
        }
    }
    return count;
};
Inventory.prototype.removeItemById = function (id, override) {
    var found = false;
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id && (override || this.items[i].can_pick_up)) {
            return this.items.splice(i, 1)[0]
        }
    }
    return undefined;
};
Inventory.prototype.removeItem = function (item) {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].equals(item)) {
            this.items.splice(i, 1);
            return;
        }
    }
};
Inventory.prototype.removeItemByName = function (name, override) {
    var found = false;
    var i;
    for (i = 0; i < this.items.length; i++) {
        if (this.items[i].matcher.test(name) && (override || this.items[i].can_pick_up)) {
            found = true;
            break;
        }
    }
    if (!found) {
        return undefined;
    }
    return this.items.splice(i, 1)[0];
};
Inventory.prototype.getStructures = function () {
    var structures = [];
    for (var i = 0; i < this.items.length; i++) {
        if (!this.items[i].can_pick_up) {
            structures.push(this.items[i]);
        }
    }
    return structures;
};
Inventory.prototype.toString = function () {
    var itms = [];
    this.items.forEach(function (item) {
        var itm_found = false;
        itms.forEach(function (chk) {
            if (chk.item.equals(item)) {
                chk.quant++;
                itm_found = true;
                return false;
            }
        });
        if (!itm_found) {
            itms.push({item: item, quant: 1});
        }
    });
    var txt = "[";
    for (var i = 0; i < itms.length; i++) {
        txt += itms[i].quant + " " + itms[i].item.toString();
        if (i < itms.length - 1) {
            txt += ", ";
        }
    }
    return txt + "]";
};
Inventory.prototype.clone = function () {
    var inv = new Inventory();
    for (var i = 0; i < this.items.length; i++) {
        inv.addItem(this.items[i].clone());
    }
};

/*
 * TODO: Biome
 */
function Biome(id, symbol, original, description, spawn_items) {
    if (original) {
        Biome.BIOMES[id] = this;
    }
    this.id = id;
    this.symbol = symbol;
    this.description = description;
    if (original) {
        this.inventory = spawn_items;
    }
    else {
        this.inventory = spawn_items || new Inventory();
    }
}
Biome.BIOMES = [];
Biome.id = -1;
Biome.prototype.symbol = " ";
Biome.prototype.discovered = false;
Biome.prototype.generated = false;
Biome.prototype.description = undefined;
Biome.prototype.inventory = undefined;
Biome.prototype.clone = function () {
    var inv = new Inventory();
    for (var i = 0; i < this.inventory.length; i++) {
        var amnt = Math.floor((Math.random() * (this.inventory[i].max_amount + 1)));
        for (var j = 0; j < amnt; j++) {
            inv.addItem(this.inventory[i].item.clone());
        }
    }
    shuffle(inv.items);
    return new Biome(this.id, this.symbol, false, this.description, inv);
};

new Biome(0, "-", true, "A flat, grassy plains", [
    {item: Item.STICK, max_amount: 5},
    {item: Item.MUD, max_amount: 5},
    {item: Item.BERRIES, max_amount: 10},
    {item: Item.GRASS, max_amount: 20}
]);
new Biome(1, "o", true, "A pleasant, sunlit woods", [
    {item: Item.STICK, max_amount: 5},
    {item: Item.ABANDONED_CABIN, max_amount: 1},
    {item: Item.GRASS, max_amount: 10},
    {item: Item.BERRIES, max_amount: 10},
    {item: Item.MUD, max_amount: 5}
]);
new Biome(2, "+", true, "A dark, foreboding forest", [
    {item: Item.STICK, max_amount: 5},
    {item: Item.BOULDER, max_amount: 1},
    {item: Item.GRASS, max_amount: 5},
    {item: Item.MUD, max_amount: 5},
    {item: Item.BERRIES, max_amount: 5},
    {item: Item.FLINT, max_amount: 3}
]);
new Biome(3, "+", true, "A dark, foreboding forest", [
    {item: Item.STICK, max_amount: 5},
    {item: Item.ABANDONED_CABIN, max_amount: 1},
    {item: Item.GRASS, max_amount: 5},
    {item: Item.MUD, max_amount: 5},
    {item: Item.BERRIES, max_amount: 5},
    {item: Item.FLINT, max_amount: 3}
]);
new Biome(4, "@", true, "Some tall, rocky mountains", [
    {item: Item.STONE, max_amount: 20},
    {item: Item.BOULDER, max_amount: 1},
    {item: Item.FLINT, max_amount: 5}
]);
new Biome(5, "@", true, "Some tall, rocky mountains", [
    {item: Item.STONE, max_amount: 20},
    {item: Item.CAVE, max_amount: 1},
    {item: Item.FLINT, max_amount: 5}
]);

/*
 * TODO: Map
 */
function Map(width, height) {
    this.width = width;
    this.height = height;
    this.regions = [];
    this.genMap();
}
Map.prototype.width = 9;
Map.prototype.height = 9;
Map.prototype.regions = [];
Map.prototype.genMap = function () {
    for (var y = 0; y < this.height; y++) {
        var row = [];
        for (var x = 0; x < this.width; x++) {
            row.push(Biome.BIOMES[0].clone());
        }
        this.regions.push(row);
    }
    var runs = Math.max(Math.floor(Math.random() * ((this.width + this.height) / 2)), 2);
    for (var i = 0; i < runs; i++) {
        x = Math.floor(Math.random() * this.width);
        y = Math.floor(Math.random() * this.height);
        this.genFeature(x, y, 5);
    }
};
Map.prototype.genFeature = function (x, y, height) {
    if (height < 0 || x < 0 || x >= this.width || y < 0 || y >= this.height || this.regions[y][x].generated) {
        return;
    }
    this.regions[y][x] = Biome.BIOMES[Math.round(height)].clone();
    this.regions[y][x].generated = true;
    this.genFeature(x - 1, y, height - Math.random());
    this.genFeature(x + 1, y, height - Math.random());
    this.genFeature(x, y - 1, height - Math.random());
    this.genFeature(x, y + 1, height - Math.random());
};
Map.prototype.displayMap = function (rpg) {
    var row = " ";
    for (var x = 0; x < this.width; x++) {
        row += " " + x;
    }
    rpg.output(row);
    for (var y = 0; y < this.height; y++) {
        row = y;
        for (x = 0; x < this.width; x++) {
            row += " " + (this.regions[y][x].discovered ? this.regions[y][x].symbol : " ");
        }
        rpg.output(row);
    }
};

/*
 * TODO: Player
 */
function Player(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.structure = undefined;
    this.max_health = Player.prototype.max_health;
    this.health = Player.prototype.health;
    this.inventory = new Inventory();
}
Player.prototype.x = 0;
Player.prototype.y = 0;
Player.prototype.structure = undefined;
Player.prototype.max_health = 100;
Player.prototype.health = Player.prototype.max_health;
Player.prototype.inventory = undefined;

/*
 * TODO: Creatures
 */
function Creature(name, matcher, health, max_health, follow_chance, dodge_chance, miss_chance, inventory, attacks, appear_text, original) {
    if (original) {
        Creature.CREATURES.push(this);
        this.inventory = inventory || [];
    }
    else {
        this.inventory = inventory || new Inventory();
    }
    this.name = name;
    this.matcher = matcher;
    this.health = health;
    this.max_health = max_health;
    this.follow_chance = follow_chance;
    this.dodge_chance = dodge_chance;
    this.miss_chance = miss_chance;
    this.attacks = attacks;
    this.appear_text = appear_text;
}
Creature.CREATURES = [];
Creature.prototype.name = undefined;
Creature.prototype.matcher = undefined;
Creature.prototype.health = undefined;
Creature.prototype.max_health = undefined;
Creature.prototype.follow_chance = undefined;
Creature.prototype.dodge_chance = undefined;
Creature.prototype.miss_chance = undefined;
Creature.prototype.inventory = undefined;
Creature.prototype.attacks = [];
Creature.prototype.appear_text = undefined;
Creature.prototype.clone = function () {
    var inv = new Inventory();
    for (var i = 0; i < this.inventory.length; i++) {
        var amnt = Math.floor((Math.random() * (this.inventory[i].max_amount + 1)));
        for (var j = 0; j < amnt; j++) {
            inv.addItem(this.inventory[i].item.clone());
        }
    }
    shuffle(inv.items);
    return new Creature(this.name, this.matcher, this.health, this.max_health, this.follow_chance, this.dodge_chance, this.miss_chance, inv, this.attacks, this.appear_text, false);
};

Creature.DEER = new Creature("deer", /^(deer|doe|buck|fawn)/i, 20, 20, 0, 0.1, 1, [
    {
        item: Item.RAW_MEAT,
        max_amount: 4
    },
    {
        item: Item.LEATHER,
        max_amount: 5
    }
], undefined, "A deer prances ahead of you.", true);
Creature.RABBIT = new Creature("rabbit", /^(bunny|rabbit)/i, 5, 5, 0, 0.3, 1, [
    {
        item: Item.RAW_MEAT,
        max_amount: 1
    }
], undefined, "A small rabbit hops into view.", true);
Creature.ORC = new Creature("orc", /^or[ck]/i, 50, 50, 0.7, 0.3, 0.5, [
    {
        item: Item.STONE_CLUB,
        max_amount: 1
    },
    {
        item: Item.LEATHER,
        max_amount: 5
    },
    {
        item: Item.RAW_MEAT,
        max_amount: 7
    },
    {
        item: Item.BERRY_PASTE,
        max_amount: 3
    }
], [
    {
        text: "The orc pummels you with his large fists.",
        fail_text: "The orc attempts to smash you, but you dodge out of the way.",
        structure_text: "The orc beats the side of your structure.",
        damage: 10
    },
    {
        text: "The orc bashes you with his club.",
        fail_text: "The orc swings his club blindly, missing you by inches.",
        structure_text: "The orc delivers a powerful blow of his club to your structure.",
        damage: 15
    }
], "A vicious orc lumbers into view.", true);
Creature.WOLF = new Creature("wolf", /^wolf/, 30, 30, 1.0, 0.6, 0.2, [
    {
        item: Item.RAW_MEAT,
        max_amount: 5
    }
], [
    {
        text: "The wolf delivers a painful bite.",
        fail_text: "The wolf lunges at you, but you dodge out of the way.",
        structure_text: "The wolf gnaws on your structure, snarling.",
        damage: 15
    },
    {
        text: "The wolf strikes you with his massive paws.",
        fail_text: "The wolf swipes at you, but the blow falls short.",
        structure_text: "The wolf huffs and puffs.",
        damage: 7
    }
], "A snarling wolf approaches menacingly.", true);

/*
 * TODO: Main
 */
function RPG(log_element, input_element) {
    this.log_element = log_element;
    this.input_element = input_element;
    var rpg = this;
    input_element.addEventListener("keydown", function (event) {
        if (event.keyCode == 13) {
            rpg.input(input_element.value.trim());
            input_element.value = "";
            return;
        }
        var accepted = false;
        if (event.keyCode == 38) {
            accepted = true;
            if (rpg.command_index > 0) {
                rpg.command_index--;
            }
        }
        else if (event.keyCode == 40) {
            accepted = true;
            if (rpg.command_index <= rpg.command_history.length - 1) {
                rpg.command_index++;
            }
        }
        if (accepted) {
            if (rpg.command_index < rpg.command_history.length && rpg.command_index >= 0) {
                input_element.value = rpg.command_history[rpg.command_index];
            }
            else {
                input_element.value = "";
            }
        }
    });
    this.map = new Map(9, 9);
    this.player = new Player(4, 4);
    this.map.regions[this.player.y][this.player.x].discovered = true;
    this.output("You wake up.");
    Verb.LOOK.run(this, Preposition.AROUND);
}
RPG.prototype.map = undefined;
RPG.prototype.creature = undefined;
RPG.prototype.player = undefined;
RPG.prototype.log_element = undefined;
RPG.prototype.input_element = undefined;
RPG.prototype.day = 0;
RPG.prototype.command_history = [];
RPG.prototype.command_index = -1;
RPG.prototype.total_commands = 0;
RPG.prototype.die = function () {
    this.output("You died after " + this.day + " days!");
    this.input_element.setAttribute("disabled", "disabled");
    this.input = function () {

    };
    this.output = this.input;
};
RPG.prototype.input = function (text) {
    var rpg = this;
    var verb_match = false;
    this.output("> " + (text = text.trim()));
    if (this.command_history[this.command_history.length - 1] != text) {
        this.command_history.push(text);
    }
    this.command_index = this.command_history.length;
    text = text.replace(/(\s+)(the|a(n)?)(\s+)/i, " ");
    this.total_commands++;
    Verb.VERBS.forEach(function (verb) {
        if (verb_match) {
            return false;
        }
        if (verb.matcher.test(text)) {
            verb_match = true;
            text = text.replace(verb.matcher, "").trim();
            var args = [rpg];
            var preposition_match = false;
            if (verb.allowed_prepositions && verb.allowed_prepositions.length > 0) {
                verb.allowed_prepositions.forEach(function (preposition) {
                    if (preposition.matcher.test(text)) {
                        preposition_match = true;
                        args.push(preposition);
                        preposition.grabNouns(text).forEach(function (noun) {
                            args.push(noun.trim());
                        });
                        return false;
                    }
                });
            }
            if (!preposition_match) {
                args.push(undefined);
                args.push(text);
            }
            verb.run.apply(verb, args);
            return false;
        }
    });
    if (!verb_match) {
        this.output("I don't know how to do that");
    }
    else if (rpg.creature && rpg.creature.attacks && rpg.creature.attacks.length > 0) {
        var attack = rpg.creature.attacks[Math.floor(Math.random() * rpg.creature.attacks.length)];
        if (Math.random() < rpg.creature.miss_chance) {
            rpg.output(attack.fail_text);
        }
        else {
            if (rpg.player.structure) {
                rpg.player.structure.durability -= attack.damage;
                rpg.player.structure.durability = Math.max(rpg.player.structure.durability, 0);
                rpg.output("The " + rpg.creature.name + " strikes the " + rpg.player.structure.name.toLowerCase() + " for " + attack.damage
                    + "hp (" + rpg.player.structure.durability + "/" + rpg.player.structure.max_durability + ")");
                if (rpg.player.structure.durability <= 0) {
                    rpg.output("The " + rpg.player.structure.name.toLowerCase() + " crumbles to dust. You are unprotected.");
                    rpg.map.regions[rpg.player.y][rpg.player.x].inventory.removeItem(rpg.player.structure);
                    rpg.player.structure = undefined;
                }
                return;
            }
            rpg.output(attack.text);
            rpg.player.health -= attack.damage;
            rpg.player.health = Math.max(rpg.player.health, 0);
            rpg.output("The " + rpg.creature.name + " attacks for " + attack.damage
                + "hp (" + rpg.player.health + "/" + rpg.player.max_health + "hp)");
            if (rpg.player.health <= 0) {
                rpg.die();
            }
        }
    }
    if (rpg.creature &&
        (rpg.player.structure || !(rpg.creature.attacks && rpg.creature.attacks.length > 0))
        && Math.random() < 0.2) {
        rpg.output("The " + rpg.creature.name + " got bored and wandered away.");
        rpg.creature = undefined;
    }
    if (rpg.total_commands % 10 == 0) {
        rpg.output("Day " + (++rpg.day));
    }
};
RPG.prototype.output = function (text) {
    var entry = document.createElement("p");
    entry.setAttribute("class", "adventure-log-entry");
    entry.innerHTML = text;
    this.log_element.appendChild(entry);
    this.log_element.scrollTop = this.log_element.scrollHeight;
};

/*
 * TODO: Verb-based action commands
 */
function Preposition(name, matcher, grabNouns) {
    Preposition.PREPOSITIONS.push(this);
    this.name = name;
    this.matcher = matcher;
    this.grabNouns = grabNouns || this.grabNouns;
}
Preposition.prototype.name = undefined;
Preposition.prototype.matcher = undefined;
Preposition.prototype.toString = function () {
    return this.name;
};
Preposition.prototype.grabNouns = function (text) {
    return [text];
};

Preposition.PREPOSITIONS = [];
Preposition.AT = new Preposition("AT", /^at/i, function (text) {
    return [text.replace(/^at(\s+)(\w+)/i, "$2").trim()];
});
Preposition.IN = new Preposition("INTO", /^(in(to)?)/i, function (text) {
    return [text.replace(/^(in(to)?)(\s+)(the(\s+))?(\w+)/i, "$6").trim()];
});
Preposition.UP = new Preposition("UP", /^(up|north)/i);
Preposition.DOWN = new Preposition("DOWN", /^(down|south)/i);
Preposition.LEFT = new Preposition("LEFT", /^(left|west)/i);
Preposition.RIGHT = new Preposition("RIGHT", /^(right|east)/i);
Preposition.AROUND = new Preposition("AROUND", /^(around|about)/i);
Preposition.WITH = new Preposition("WITH", /^((.+)(\s+))?(with|and)((\s+)(.+))?/i, function (text) {
    if (!/^((.+)(\s+)(with|and)(\s+)(.+))/i.test(text)) {
        return [text.replace(/^((.+)(\s+)(with|and))/i, "$2")];
    }
    var val1 = text.replace(/^((.+)(\s+)(with|and)(\s+)(.+))/i, "$2");
    var val2 = text.replace(/^((.+)(\s+)(with|and)(\s+)(.+))/i, "$6");
    return [val1, val2];
});
Preposition.ON = new Preposition("ON", /^((\w+)(\s+))?on((\s+)(\w+))?/i, function (text) {
    if (!/^((.+)(\s+)(on)(\s+)(.+))/i.test(text)) {
        return [text.replace(/^((.+)(\s+)(on))/i, "$2")];
    }
    var val1 = text.replace(/^(\w+)(\s+)on(\s+)(\w+)/i, "$1");
    var val2 = text.replace(/^(\w+)(\s+)on(\s+)(\w+)/i, "$4");
    return [val1, val2];
});

function Verb(matcher, run, allowed_prepositions, help) {
    Verb.VERBS.push(this);
    this.run = run || this.run;
    this.matcher = matcher;
    this.allowed_prepositions = allowed_prepositions || [];
    this.help = help || [];
}
Verb.prototype.matcher = undefined;
Verb.prototype.allowed_prepositions = [];
Verb.prototype.run = function () {
};
Verb.prototype.help = [];

Verb.VERBS = [];
Verb.TAKE = new Verb(/^(take|grab|(pick(\s+)up))\b/i, function (rpg, preposition, object) {
    if (!object) {
        rpg.output("Take what?");
        return;
    }
    var biome_inv = rpg.map.regions[rpg.player.y][rpg.player.x].inventory;
    if (biome_inv.items.length == 0) {
        rpg.output("The area has been picked clean");
        return;
    }
    var item = biome_inv.removeItemByName(object);
    if (!item) {
        rpg.output("You could not find " + object);
        return;
    }
    rpg.player.inventory.addItem(item);
    rpg.output("You found : " + item.toString());
}, [], ["take &lt;object&gt;"]);
Verb.DROP = new Verb(/^(drop|(put(\s+)down))\b/i, function (rpg, preposition, object) {
    if (!object) {
        rpg.output("Drop what?");
        return;
    }
    if (rpg.player.inventory.items.length == 0) {
        rpg.output("You have nothing to drop.");
        return;
    }
    var item = rpg.player.inventory.removeItemByName(object, true);
    if (!item) {
        rpg.output("You don't have any of that.");
        return;
    }
    rpg.map.regions[rpg.player.y][rpg.player.x].inventory.addItem(item);
    rpg.output("You dropped: " + item.toString());
}, [], ["drop &lt;object&gt;"]);
Verb.SCAVENGE = new Verb(/^(scavenge|forage)\b/i, function (rpg) {
    var biome_inv = rpg.map.regions[rpg.player.y][rpg.player.x].inventory;
    var i;
    var found = false;
    for (i = 0; i < biome_inv.items.length; i++) {
        if (biome_inv.items[i].can_pick_up) {
            found = true;
            break;
        }
    }
    if (!found) {
        rpg.output("The area has been picked clean");
        return;
    }
    var item = biome_inv.items.splice(i, 1)[0];
    rpg.player.inventory.addItem(item);
    rpg.output("You found : " + item.toString());
}, [], ["scavenge"]);
Verb.LOOK = new Verb(/^look\b/i, function (rpg, preposition, object) {
    if (!preposition) {
        rpg.output("Look where?");
        return;
    }
    if (preposition == Preposition.AT) {
        if (!object) {
            rpg.output("Look at what?");
            return;
        }
        if (/^(chart|map)/.test(object)) {
            rpg.map.displayMap(rpg);
            rpg.output("Your position: (" + rpg.player.x + ", " + rpg.player.y + ")");
        }
        else if (/^(inventory|((bag|pocket)(s)?))/i.test(object)) {
            rpg.output("Your inventory: " + rpg.player.inventory.toString());
        }
        else if (/^(((my)?self)|status|health)/i.test(object)) {
            rpg.output("Your status: " + ((rpg.player.health / rpg.player.max_health) * 100.0)
                + "% (" + rpg.player.health + "/" + rpg.player.max_health + "hp)");
        }
        else if (/^((crafting(\s+))?recipe(s)?)/i.test(object)) {
            rpg.output("Learned recipes:");
            Recipe.recipes.forEach(function (recipe) {
                if (recipe.discovered) {
                    rpg.output(" - " + recipe.toString());
                }
            });
        }
        else {
            var search = rpg.map.regions[rpg.player.y][rpg.player.x].inventory.getStructures();
            for (var i = 0; i < search.length; i++) {
                if (search[i].matcher.test(object)) {
                    rpg.output(search[i].toString());
                    rpg.output(search[i].description);
                    return;
                }
            }
            search = rpg.player.inventory.items;
            for (i = 0; i < search.length; i++) {
                if (search[i].matcher.test(object)) {
                    rpg.output(search[i].toString());
                    rpg.output(search[i].description);
                    return;
                }
            }
            rpg.output("You cannot find that.");
        }
    }
    else if (preposition == Preposition.AROUND) {
        var biome = rpg.map.regions[rpg.player.y][rpg.player.x];
        var txt = "You look around. You are in " + biome.description.toLowerCase() + ".";
        var structures = biome.inventory.getStructures();
        if (structures.length > 0) {
            txt += " There is " + structures[0].description;
        }
        rpg.output(txt);
    }
}, [Preposition.AT, Preposition.AROUND], ["look at &lt;object|map|inventory|recipes&gt;", "look around"]);
Verb.INSPECT = new Verb(/^(inspect|examine|view)\b/i, function (rpg, preposition, object) {
    Verb.LOOK.run(rpg, Preposition.AT, object);
}, [], ["inspect &lt;object|map|inventory|recipes&gt;"]);
Verb.USE = new Verb(/^use\b/i, function (rpg, preposition, object) {
    if (!object) {
        rpg.output("Use what?");
        return;
    }
    var item = rpg.player.inventory.removeItemByName(object, false);
    if (!item) {
        rpg.output("You don't have one of those!");
        return;
    }
    if (!item.is_food && item.heal_value != 0) {
        rpg.player.health += item.heal_value;
        rpg.player.health = Math.min(rpg.player.health, rpg.player.max_health);
        rpg.output("You used the " + item.name.toLowerCase() + " and regained " + item.heal_value
            + " (" + rpg.player.health + "/" + rpg.player.max_health + "hp)");
    }
    else {
        rpg.output("You cannot use that item.");
    }
}, [], ["use &lt;object&gt;"]);
Verb.EAT = new Verb(/^(eat|consume)\b/i, function (rpg, preposition, object) {
    if (!object) {
        rpg.output("Eat what?");
        return;
    }
    var item = rpg.player.inventory.removeItemByName(object);
    if (!item) {
        rpg.output("You don't have any of that.");
        return;
    }
    if (item.is_food) {
        rpg.player.health += item.heal_value;
        rpg.player.health = Math.min(rpg.player.health, rpg.player.max_health);
        rpg.output("You eat the " + item.name.toLowerCase() + ", restoring " + item.heal_value + "hp");
        if (rpg.player.health < 0) {
            rpg.die();
        }
    }
    else {
        rpg.output("That item is not edible.");
        rpg.player.inventory.addItem(item);
    }
}, [], ["eat &lt;object&gt;"]);
Verb.ENTER = new Verb(/^(enter)\b/i, function (rpg, preposition, object) {
    if (rpg.player.structure) {
        rpg.output("You are already inside.");
        return;
    }
    var biome = rpg.map.regions[rpg.player.y][rpg.player.x];
    var structures = biome.inventory.getStructures();
    if (structures.length == 0) {
        rpg.output("There are no shelters nearby.");
        return;
    }
    for (var i = 0; i < structures.length; i++) {
        if (structures[i].matcher.test(object)) {
            rpg.output("You take shelter in the " + structures[i].name.toLowerCase() + ".");
            rpg.player.structure = structures[i];
            return;
        }
    }
    rpg.output("You cannot find a " + object + ".");
}, [], ["enter &lt;structure&gt;"]);
Verb.EXIT = new Verb(/^(exit|leave)\b/i, function (rpg) {
    if (!rpg.player.structure) {
        rpg.output("You are not in a shelter");
        return;
    }
    rpg.output("You exit the " + rpg.player.structure.name.toLowerCase() + ".");
    rpg.player.structure = undefined;
}, [], ["exit"]);
Verb.GO = new Verb(/^(go|travel|walk|run)\b/i, function (rpg, preposition, object) {
    var moved = false;
    if (preposition == Preposition.UP) {
        if (rpg.player.structure) {
            rpg.output("You are still in a shelter.");
            return;
        }
        if (rpg.player.y <= 0) {
            rpg.output("You cannot go North.");
            return;
        }
        rpg.player.y--;
        moved = true;
    }
    else if (preposition == Preposition.DOWN) {
        if (rpg.player.structure) {
            rpg.output("You are still in a shelter.");
            return;
        }
        if (rpg.player.y >= rpg.map.height - 1) {
            rpg.output("You cannot go South.");
            return;
        }
        rpg.player.y++;
        moved = true;
    }
    else if (preposition == Preposition.LEFT) {
        if (rpg.player.structure) {
            rpg.output("You are still in a shelter.");
            return;
        }
        if (rpg.player.x <= 0) {
            rpg.output("You cannot go West.");
            return;
        }
        rpg.player.x--;
        moved = true;
    }
    else if (preposition == Preposition.RIGHT) {
        if (rpg.player.structure) {
            rpg.output("You are still in a shelter.");
            return;
        }
        if (rpg.player.x >= rpg.map.width - 1) {
            rpg.output("You cannot go East.");
            return;
        }
        rpg.player.x++;
        moved = true;
    }
    else if (preposition == Preposition.IN) {
        Verb.ENTER.run(rpg, object);
    }
    else {
        rpg.output("I don't know where that is");
        return;
    }
    var biome = rpg.map.regions[rpg.player.y][rpg.player.x];
    biome.discovered = true;
    if (moved) {
        Verb.LOOK.run(rpg, Preposition.AROUND);
        if (rpg.creature) {
            if (Math.random() < rpg.creature.follow_chance) {
                rpg.output("The " + rpg.creature.name + " followed you.");
            }
            else {
                rpg.output("You lost the " + rpg.creature.name + " somewhere behind you.");
                rpg.creature = undefined;
            }
        }
        if (!rpg.creature && Math.random() < 0.3) {
            rpg.creature = Creature.CREATURES[Math.floor(Math.random() * Creature.CREATURES.length)].clone();
            rpg.output(rpg.creature.appear_text);
        }
    }
}, [Preposition.UP, Preposition.DOWN, Preposition.LEFT, Preposition.RIGHT, Preposition.IN], ["go &lt;direction&gt;"]);
Verb.CRAFT = new Verb(/^(combine|craft)\b/i, function (rpg, preposition, object1, object2) {
    var recipe;
    if (!object1) {
        rpg.output("Craft what?");
        return;
    }
    if (!preposition) {
        var recipe_found = false;
        for (var i = 0; i < Recipe.recipes.length; i++) {
            recipe = recipe = Recipe.recipes[i];
            if (recipe.result.matcher.test(object1) && recipe.discovered) {
                recipe_found = true;
                if (recipe.craft(rpg, rpg.player.inventory)) {
                    return;
                }
            }
        }
        if (!recipe_found) {
            rpg.output("I don't know how to craft that.");
        }
        return;
    }
    if (!object2) {
        rpg.output("Craft with what?");
        return;
    }
    for (i = 0; i < Recipe.recipes.length; i++) {
        recipe = Recipe.recipes[i];
        if (recipe.item_2) {
            if ((recipe.item_1.matcher.test(object1) && recipe.item_2.matcher.test(object2))
                || (recipe.item_1.matcher.test(object2) && recipe.item_2.matcher.test(object1))) {
                recipe.craft(rpg, rpg.player.inventory);
                if (!recipe.discovered) {
                    recipe.discovered = true;
                    rpg.output("You learned a new recipe!");
                }
                return;
            }
        }
        else {
            if ((recipe.item_1.matcher.test(object1) && /^(no(thing|ne))/i.test(object2))
                || (recipe.item_1.matcher.test(object2) && /^(no(thing|ne))/i.test(object1))) {
                recipe.craft(rpg, rpg.player.inventory);
                if (!recipe.discovered) {
                    recipe.discovered = true;
                    rpg.output("You learned a new recipe!");
                }
                return;
            }
        }
    }
    rpg.output("Those don't go together.");
}, [Preposition.WITH], ["craft &lt;object&gt; [with &lt;object&gt;]"]);
Verb.ATTACK = new Verb(/^(attack|strike)\b/i, function (rpg, preposition, object1, object2) {
    if (!object1) {
        rpg.output("Attack what?");
        return;
    }
    var item = undefined;
    if (preposition) {
        if (!object2) {
            rpg.output("Attack with what?");
            return;
        }
        item = rpg.player.inventory.removeItemByName(object2);
        if (!item) {
            rpg.output("You don't have one of those!");
            return;
        }
    }
    else {
        rpg.player.inventory.items.forEach(function (test_item) {
            if (!item) {
                item = test_item;
                return true;
            }
            if (item.damage < test_item.damage || (item.damage == test_item.damage && item.durability > test_item.durability)) {
                item = test_item;
            }
        });
        if (item) {
            rpg.player.inventory.removeItem(item);
        }
    }
    if (!rpg.creature) {
        rpg.output("There's nothing to attack");
        return;
    }
    if (!rpg.creature.matcher.test(object1)) {
        rpg.output("There's no " + object1 + " nearby to attack");
        return;
    }
    if (!item) {
        item = new Item(-1, "your fists", undefined, false, 3, 1, 1);
    }
    rpg.creature.health -= item.damage;
    rpg.creature.health = Math.max(rpg.creature.health, 0);
    rpg.output("You attack the " + rpg.creature.name + " with " + item.name.toLowerCase() + " for " + item.damage
        + "hp (" + rpg.creature.health + "/" + rpg.creature.max_health + "hp)");
    if (item.max_durability > 0) {
        item.durability--;
    }
    if (item.max_durability <= 0 || item.durability > 0) {
        rpg.player.inventory.addItem(item);
    }
    else if (item.id >= 0) {
        rpg.output("The " + item.name.toLowerCase() + " broke into pieces.");
    }
    if (rpg.creature.health <= 0) {
        rpg.output("You have slain the " + rpg.creature.name + ", its spoils dropping to the ground.");
        rpg.creature.inventory.items.forEach(function (spoil) {
            rpg.map.regions[rpg.player.y][rpg.player.x].inventory.addItem(spoil);
        });
        rpg.creature = undefined;
    }
}, [Preposition.WITH], ["attack &lt;creature&gt; [with &lt;object&gt;]"]);
Verb.WAIT = new Verb(/^(wait|(do(\s+)nothing))\b/i, function (rpg) {
    rpg.output("You wait a while.");
}, [], ["wait"]);
Verb.HELP = new Verb(/^help\b/i, function (rpg, preposition, object) {
    if (!object) {
        rpg.output("Valid commands:");
        Verb.VERBS.forEach(function (verb) {
            rpg.output(" - " + verb.help[0].split(" ", 2)[0]);
        });
    }
    else {
        var verb_found = false;
        Verb.VERBS.forEach(function (verb) {
            if (verb.matcher.test(object)) {
                verb_found = true;
                rpg.output("Help for \"" + verb.help[0].split(" ", 2)[0] + "\":");
                verb.help.forEach(function (help) {
                    rpg.output(" - " + help);
                });
                return false;
            }
        });
        if (!verb_found) {
            rpg.output("I don't know anything about that.");
        }
    }
}, [], ["help [command]"]);
Verb.SAVE = new Verb(/^save\b/i, function (rpg) {
    var save = {
        map: rpg.map,
        player: rpg.player,
        creature: rpg.creature,
        command_history: rpg.command_history,
        command_index: rpg.command_index,
        total_commands: rpg.total_commands,
        day: rpg.day,
        recipes: Recipe.recipes
    };
    localStorage.setItem("rpg_save", JSON.stringifyWithTypes(save));
    rpg.output("Save complete");
}, [], ["save"]);
Verb.LOAD = new Verb(/^load\b/i, function (rpg) {
    var save = localStorage.getItem("rpg_save");
    if (!save) {
        rpg.output("No save detected!");
        return;
    }
    save = JSON.parseWithTypes(save);
    rpg.map = save.map;
    rpg.player = save.player;
    rpg.creature = save.creature;
    rpg.command_history = save.command_history;
    rpg.command_index = save.command_index;
    rpg.total_commands = save.total_commands;
    rpg.day = save.day;
    Recipe.recipes = save.recipes;
    rpg.output("Save loaded!");
}, [], ["load"]);

/**
 * Generate a JSON string with object prototypes intact
 *
 * @param {*} value
 * @param {Function} [replacer]
 * @param {Number|String} [space]
 * @return {String}
 * @static
 */
JSON.stringifyWithTypes = function (value, replacer, space) {
    // No value? Not an object? Don't care.
    if (value !== undefined && value !== null && typeof value === "object") {
        // Recursive call to handle inner properties
        Object.keys(value).forEach(function (key) {
            // Make sure the property directly belongs to the object
            if (value.hasOwnProperty(key)) {
                JSON.stringifyWithTypes(value[key], replacer, space);
            }
        });
        // If the value has a prototype, store its name in the __jsonproto__ meta tag
        if (value.__proto__) {
            value.__jsonproto__ = value.__proto__.getName();
        }
    }
    // Normal JSON generation
    return JSON.stringify(value, replacer, space);
};

/**
 * Parse a JSON string and set object prototypes, if provided
 *
 * @param {String} json_string
 * @param {Function} [reviver]
 * @return {*}
 * @static
 */
JSON.parseWithTypes = function (json_string, reviver) {
    var setProto = function (obj, parent, key) {
        // Not an object? Don't care.
        if (typeof obj !== "object") {
            return;
        }
        // Check for meta tag
        if (obj.hasOwnProperty("__jsonproto__")) {
            // Set the prototype
            obj.__proto__ = eval(obj.__jsonproto__ + ".prototype");
            // Special handling for RegExp objects
            if (obj instanceof RegExp) {
                parent[key] = new RegExp(obj.source, obj.flags);
            }
            // Remove the meta tag
            obj.__jsonproto__ = undefined;
        }
        // Recursive call to handle inner properties
        Object.keys(obj).forEach(function (key) {
            if (typeof obj[key] == "object") {
                setProto(obj[key], obj, key);
            }
        });
    };
    // Light wrapper to contain the parsed object
    var parsed = {object: JSON.parse(json_string, reviver)};
    setProto(parsed.object, parsed, "object");
    return parsed.object;
};

// Have to do this because RegExp objects don't play very well with JSON
RegExp.prototype.toJSON = function () {
    return {
        source: this.source,
        flags: this.flags,
        __jsonproto__: "RegExp"
    }
};

Object.prototype.getName = function () {
    var results = /function(\s+)(.+)(\s*)\(/.exec((this).constructor.toString());
    return (results && results.length > 2) ? results[2] : "";
};
