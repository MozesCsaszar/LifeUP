import { Skill } from "./skill";
import { Inventory } from "./inventory";
import { Config } from "../config";
export class BoundedVar {
    constructor(val, max, min) {
        this._val = val;
        this._min = min ?? 0;
        this._max = max ?? val;
    }
    get val() {
        return this._val;
    }
    set val(newVal) {
        this._val = newVal > this._max ? this._max : newVal;
        this._val = newVal < this._min ? this._min : this._val;
    }
    get min() {
        return this._min;
    }
    set min(newVal) {
        this._min = newVal > this._val ? this._val : newVal;
    }
    get max() {
        return this._max;
    }
    set max(newVal) {
        this._max = newVal < this._val ? this._val : newVal;
    }
    ToString() {
        return `${Config.FormatNumber(this.val)}/${Config.FormatNumber(this.max)}`;
    }
}
export class PlayerResourceChange {
    constructor(health, stamina, mana) {
        this.health = health;
        this.stamina = stamina;
        this.mana = mana;
    }
}
export class PlayerResources {
    constructor(startingValues = 100) {
        this.health = new BoundedVar(startingValues);
        this.stamina = new BoundedVar(startingValues);
        this.mana = new BoundedVar(startingValues);
    }
    Update(resourceChange) {
        this.health.val += resourceChange.health;
        this.stamina.val += resourceChange.stamina;
        this.mana.val += resourceChange.mana;
    }
}
export class Player {
    constructor() {
        this.skills = new Map();
        Config.SkillNames.forEach((skillName) => {
            this.skills.set(skillName, new Skill(skillName));
        });
        this.resources = new PlayerResources();
        this.inventory = new Inventory();
    }
    Update(dTime) { }
}
