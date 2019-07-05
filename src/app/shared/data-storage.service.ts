import { Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { RecipesComponent } from "../recipes/recipes.component";
import { Ingredient } from "./ingredient.model";

@Injectable()
export class DataStorageService {
    
    constructor(
        private http: Http, 
        private recipeService: RecipeService,
        private authService: AuthService) {}
    
    
    storeRecipes() {
        
        const recipes = this.recipeService.getRecipers();

        for(let recipe of recipes) {

            let recipeData = {
                name: recipe.name,
                description: recipe.description,
                imagePath: recipe.imagePath
            }

            if(recipe.id) {
                this.http.put('http://127.0.0.1:8000/api/recipes/' + recipe.id + '/', recipeData)
                .subscribe(
                    success => {
                        console.log('OK WHILE PUT EXISTED RECIPE');
                        for(let ingredient of recipe.ingredients) {
                    
                            let ingredientData = {
                                recipe: recipe.id,
                                name : ingredient.name,
                                amount : ingredient.amount
                            }

                            if(ingredient.id) {
                                this.http.put('http://127.0.0.1:8000/api/recipes/' + recipe.id +'/ingredients/' + ingredient.id + '/', ingredientData)
                                .subscribe(
                                    response => {
                                    },
                                    error => {
                                        console.log('ERROR WHILE ADDING EXISTED INGREDIENTS TO EXISTED RECIPES')
                                    }
                                );
                            } else {
                                let id;
                                this.http.post('http://127.0.0.1:8000/api/recipes/' + recipe.id +'/ingredients/', ingredientData)
                                .subscribe(
                                    response => {
                                        let data = response.json();
                                        id = data['id'];
                                        ingredient.id = id;
                                    },
                                    error => {
                                        console.log('ERROR WHILE ADDING NEW INGREDIENTS TO EXISTED RECIPES')
                                    }
                                );
                            }
        
                        }
                    },
                    error => {
                        console.log('ERROR WHILE PUTING RECIPE');
                    }
                );
                
            } else {

                let id;

                this.http.post('http://127.0.0.1:8000/api/recipes/', recipeData)
                    .subscribe(
                        response => {
                            let data = response.json();
                            id = data['id']
                            recipe.id = id;

                            for(let ingredient of recipe.ingredients) {
                
                                let ingredientData = {
                                    recipe: id,
                                    name : ingredient.name,
                                    amount : ingredient.amount
                                }
            
                                this.http.post('http://127.0.0.1:8000/api/recipes/' + id +'/ingredients/', ingredientData)
                                .subscribe(
                                    response => {
                                    },
                                    error => {
                                        console.log('ERROR WHILE ADDING INGREDIENTS TO NEW RECIPES')
                                    }
                                );
                            }

                        },
                        error => {
                            console.log('ERROR WHILE MAKING RECIPE')
                        }
                    );
            }
        }
    }

    getRecipes() {

        return this.http.get('http://127.0.0.1:8000/api/recipes/')
            .pipe(map(
                (response: Response) => {
                    const recipes: Recipe[] = response.json();
                    for (let recipe of recipes) {
                        if (!recipe['ingredients']) {
                            recipe['ingredients'] = [];
                        }
                    }
                    return recipes;
                }
            )).subscribe(
                (recipes: Recipe[]) => {
                    for(let recipe of recipes) {
                        this.http.get('http://127.0.0.1:8000/api/recipes/' + recipe.id + '/ingredients/')
                            .pipe(map(
                                (response: Response) => {
                                    const ingredients: Ingredient[] = response.json();
                                    return ingredients;
                                }
                            )).subscribe(
                                (ingredients: Ingredient[]) => {
                                    recipe.ingredients = ingredients;
                                }
                            );
                    }
                    this.recipeService.setRecipes(recipes);
                }
            );
    }
}