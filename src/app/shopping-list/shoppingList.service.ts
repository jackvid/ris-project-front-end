import { Ingredient } from "../shared/ingredient.model";
import { Subject } from "rxjs";

export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();
    
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatos', 10)];

    getIngredients() {
        return this.ingredients.slice();
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
        newIngredient.id = this.ingredients[index].id;
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredient(ingredient: Ingredient) {
        for(let ingEl of this.getIngredients()) {
            if( ingEl.name == ingredient.name ) {
                ingEl.amount = +ingEl.amount + +ingredient.amount;
                this.ingredientsChanged.next(this.ingredients.slice());
                return; 
            }
        } 
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice()); 
    }

    addIngredients(ingredients: Ingredient[]) {
        let index = 0;
        for(let baseEl of this.getIngredients()) {
            for(let newEl of ingredients) {
                index ++;
                if( baseEl.name == newEl.name) {
                    baseEl.amount = +baseEl.amount + +newEl.amount;
                    ingredients.splice(index-1, 1);
                }
            }
            index = 0;
        }
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}