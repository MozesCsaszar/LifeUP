import { Skill } from "./skill";
import { Inventory } from "./inventory";
import { Config } from "../config";

export class BoundedVar {
  private _val: number;
  private _min: number;
  private _max: number;
  constructor(val: number, max?: number, min?: number);
  constructor(val: number, max: number, min?: number);
  constructor(val: number, max: number, min: number) {
    this._val = val;
    this._min = min ?? 0;
    this._max = max ?? val;
  }
  get val() {
    return this._val;
  }
  set val(newVal: number) {
    this._val = newVal > this._max ? this._max : newVal;
    this._val = newVal < this._min ? this._min : this._val;
  }
  get min() {
    return this._min;
  }
  set min(newVal: number) {
    this._min = newVal > this._val ? this._val : newVal;
  }
  get max() {
    return this._max;
  }
  set max(newVal: number) {
    this._max = newVal < this._val ? this._val : newVal;
  }
  ToString() {
    return `${Config.FormatNumber(this.val)}/${Config.FormatNumber(this.max)}`;
  }
}

export class PlayerResourceChange {
  health: number;
  stamina: number;
  mana: number;
  constructor(health: number, stamina: number, mana: number) {
    this.health = health;
    this.stamina = stamina;
    this.mana = mana;
  }
}

export class PlayerResources {
  health: BoundedVar;
  stamina: BoundedVar;
  mana: BoundedVar;

  constructor(startingValues: number = 100) {
    this.health = new BoundedVar(startingValues);
    this.stamina = new BoundedVar(startingValues);
    this.mana = new BoundedVar(startingValues);
  }

  Update(resourceChange: PlayerResourceChange) {
    this.health.val += resourceChange.health;
    this.stamina.val += resourceChange.stamina;
    this.mana.val += resourceChange.mana;
  }
}

export class Player {
  skills: Map<string, Skill> = new Map<string, Skill>();
  resources: PlayerResources;
  inventory: Inventory;

  constructor() {
    Config.SkillNames.forEach((skillName) => {
      this.skills.set(skillName, new Skill(skillName));
    });
    this.resources = new PlayerResources();
    this.inventory = new Inventory();
  }

  Update(dTime: number) {}
}
