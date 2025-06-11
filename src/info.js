import { viewPokemon } from "./API.js";

window.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const pokemonId = params.get('id');

    const { stats, description } = await viewPokemon(pokemonId);//se lo enviamos a la funcion para que haga la peticion a la api

    const {id, name, base_experience, height, order, weight, abilities, sprites:{front_default, front_shiny}} = stats;

    const { flavor_text_entries } = description;

    //obtenemos la descripcion del pokemon
    const pokemonDescription = flavor_text_entries[0].flavor_text;
    console.log(pokemonDescription);
    
    
    
    
    
    
    
})