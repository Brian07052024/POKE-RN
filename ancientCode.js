window.addEventListener("DOMContentLoaded", () => {
    const pkmnContainer = document.getElementById("pkmns-container");
    let urlPokemon = "https://pokeapi.co/api/v2/pokemon/1/";

    let pokemons = [];

    const typeColors = {
        normal:    "#A8A77A",
        fire:      "#EE8130",
        water:     "#6390F0",
        electric:  "#F7D02C",
        grass:     "#7AC74C",
        ice:       "#96D9D6",
        fighting:  "#C22E28",
        poison:    "#A33EA1",
        ground:    "#E2BF65",
        flying:    "#A98FF3",
        psychic:   "#F95587",
        bug:       "#A6B91A",
        rock:      "#B6A136",
        ghost:     "#735797",
        dragon:    "#6F35FC",
        dark:      "#705746",
        steel:     "#B7B7CE",
        fairy:     "#D685AD"
    };

    for (let i = 1; i <= 151; i++) {
        urlPokemon = `https://pokeapi.co/api/v2/pokemon/${i}/`;
        consultarAPI(urlPokemon);
    }

    async function consultarAPI(url){
        try {
            const peticion =  await fetch(url);
            const respuesta = await peticion.json();
            // console.log(respuesta);
            
            contarPokemons(respuesta);
        }catch(error){
            console.error("Error al consultar la API:", error);
        }
    }

    function contarPokemons(pokemonArray){
        pokemons.push(pokemonArray);
        if(pokemons.length === 151){
            pokemons.sort((a, b) => a.id - b.id);
            construirPokemon(pokemons);
        }
    }
    
    function construirPokemon(pokemonArray){
        pkmnContainer.innerHTML = "";
        pokemonArray.forEach(pokemon => {
            // console.log(pokemon);
            
            const { sprites:{front_default}, id, name, types} = pokemon;
            // console.log(types);
            
            const tipos = consultarTipos(types);
            // console.log(tipos);
            
            const article = document.createElement("ARTICLE");
            article.classList.add("rounded-4xl","overflow-hidden","shadow-xl","w-full", "hover:-translate-y-1", "transition", "cursor-pointer");
            
            const imageContainer = document.createElement("DIV");
            imageContainer.classList.add("h-60","relative","flex","items-center","justify-center","bg-cover","bg-center", "bg-white");

            const imageBg = document.createElement("IMG");
            imageBg.src = "./src/img/Pokeball.webp";
            imageBg.setAttribute("alt", "Pokeball background"); // <-- alt agregado
            imageBg.classList.add("absolute","inset-0","w-full","h-full","object-cover","opacity-20","pointer-events-none","select-none");

            const imagePkmn = document.createElement("IMG");
            imagePkmn.src = front_default;
            imagePkmn.setAttribute("alt", name); // <-- alt personalizado con el nombre del Pokémon
            imagePkmn.classList.add("relative","z-10","opacity-100", "size-28");

            imageContainer.appendChild(imageBg);
            imageContainer.appendChild(imagePkmn);

            article.appendChild(imageContainer);
            // CARD BOTTOM:
            const infoBg = document.createElement("DIV");
            infoBg.classList.add("bg-black","h-24","text-white");

            const infoContainer = document.createElement("DIV");
            infoContainer.classList.add("mx-3","py-1","flex","flex-col","gap-2");

            const pokemonData = document.createElement("DIV");
            pokemonData.classList.add("flex", "items-center", "gap-2", "justify-center");

            const pokemonSpan = document.createElement("SPAN");
            pokemonSpan.classList.add("font-bold","text-3xl");
            pokemonSpan.textContent = `#${id}`;

            const pokemonName = document.createElement("P");
            pokemonName.classList.add("font-bold","text-3xl");
            pokemonName.textContent = name.toUpperCase();

            const typeContainer = document.createElement("DIV");
            typeContainer.classList.add("flex", "justify-evenly", "uppercase")

            infoBg.appendChild(infoContainer);
            pokemonData.appendChild(pokemonSpan);
            pokemonData.appendChild(pokemonName);
            infoContainer.appendChild(pokemonData);

           Object.values(tipos).forEach(tipo => {
                const typeInfo = document.createElement("P");
                typeInfo.classList.add("w-24", "rounded-2xl", "px-4", "py-1", "text-white", "font-bold", "text-center", "outline-2");
                typeInfo.textContent = tipo;
                // Aplica el color según el tipo
                typeInfo.style.backgroundColor = typeColors[tipo] || "#FFD700"; // Amarillo por defecto si no existe
                typeContainer.appendChild(typeInfo);
            });

            infoContainer.appendChild(typeContainer);

            
            article.appendChild(infoBg);

            pkmnContainer.appendChild(article);

        });

    };

    function consultarTipos(types){
        
        if(types.length === 2){
            const tipos = {
                tipo1: types[0].type.name,
                tipo2: types[1].type.name
            };
            return Object.values(tipos);
            
        }else{
            const tipos = [types[0].type.name];
            return tipos;
        };
        
    };

});