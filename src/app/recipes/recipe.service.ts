import { Recipe } from "./recipe.model";
import { Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shoppingList.service";
import { Subject, throwError } from "rxjs";
import { Http } from "@angular/http";

@Injectable()
export class RecipeService {

    recipeChanged = new Subject<Recipe[]>();
    recipeDeleted = new Subject<Number>();
    
    private recipes: Recipe[] = [];

    constructor(
        private shoppingListService: ShoppingListService,
        private http: Http) {}

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        return this.recipeChanged.next(this.recipes.slice());
    }

    getRecipers() {
        return this.recipes.slice();
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    getRecipe(id: number): Recipe {
        return this.recipes[id];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        for(let ingredient of this.recipes[index].ingredients){
            this.http.delete('http://127.0.0.1:8000/api/recipes/' + this.recipes[index].id + '/ingredients/' + ingredient.id + '/')
            .subscribe(
                response => {
                    console.log("OBRISANO");
                }
            );
        }

        newRecipe.id = this.recipes[index].id;
        this.recipes[index] = newRecipe;
        this.recipeChanged.next(this.recipes.slice());
    }


    deleteRecipe(index: number) {
        this.http.delete('http://127.0.0.1:8000/api/recipes/' + this.recipes[index].id + '/').subscribe(
            response => {
                console.log("OBRISANO");
            }
        );

        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice());

        
    }

    

}