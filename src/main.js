window.addEventListener("DOMContentLoaded", async () => {
    const pkmnContainer = document.getElementById("pkmns-container");
    const formNumber = document.querySelector("#form-number");
    const formName = document.querySelector("#form-name");

    const typeFilter = document.querySelector("#type-filter");
    const typeNav = document.querySelector("#types-nav");

    typeFilter.addEventListener("click", () => {
        if(typeNav.classList.contains("nav-hidden")){
            typeNav.classList.remove("nav-hidden");
            typeNav.classList.add("nav-visible");
            
            
        }else if(typeNav.classList.contains("nav-visible")){
            typeNav.classList.remove("nav-visible");
            typeNav.classList.add("ocultar-anim")
            setTimeout(() => {
                typeNav.classList.add("nav-hidden");
            }, 200);

        }
    });

    formNumber.addEventListener("submit", async (e) => {
        e.preventDefault();
        searchAPI(e, "number");
    });

    formName.addEventListener("submit", async (e) => {
        e.preventDefault();
        searchAPI(e, "name");
    });

    const typeColors = {
        normal:    "#A8A77A", fire:      "#EE8130", water:     "#6390F0",
        electric:  "#F7D02C", grass:     "#7AC74C", ice:       "#96D9D6",
        fighting:  "#C22E28", poison:    "#A33EA1", ground:    "#E2BF65",
        flying:    "#A98FF3", psychic:   "#F95587", bug:       "#A6B91A",
        rock:      "#B6A136", ghost:     "#735797", dragon:    "#6F35FC",
        dark:      "#705746", steel:     "#B7B7CE", fairy:     "#D685AD"
    };

    // Creamos un array de promesas
    const fetches = [];
    for (let i = 1; i <= 151; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
        fetches.push( fetch(url)
        .then( respuesta => respuesta.json() ) );
    };

    try {
        const pokemons = await Promise.all(fetches);
        pokemons.sort((a, b) => a.id - b.id); // Aseguramos el orden por ID
        construirPokemon(pokemons);
    } catch (error) {
        console.error("Error al consultar la API:", error);
    }

    function construirPokemon(pokemonArray) {

        pkmnContainer.innerHTML = "";

        pokemonArray.forEach(pokemon => {
            const { sprites: { front_default }, id, name, types } = pokemon;

            const tipos = types.map(t => t.type.name);

            const article = document.createElement("ARTICLE");
            article.classList.add("rounded-4xl", "overflow-hidden", "shadow-xl", "w-full", "border-4", "hover:-translate-y-1", "transition", "cursor-pointer");
            article.setAttribute("id", id);

            const imageContainer = document.createElement("DIV");
            imageContainer.classList.add("h-60", "relative", "flex", "items-center", "justify-center", "bg-cover", "bg-center", "bg-white");

            const imageBg = document.createElement("IMG");
            imageBg.src = "./src/img/Pokeball.webp";
            imageBg.alt = "Pokeball background";
            imageBg.classList.add("absolute", "inset-0", "w-full", "h-full", "object-cover", "opacity-20", "pointer-events-none", "select-none");

            const imagePkmn = document.createElement("IMG");
            imagePkmn.src = front_default;
            imagePkmn.alt = name;
            imagePkmn.classList.add("relative", "z-10", "opacity-100", "size-28");

            imageContainer.appendChild(imageBg);
            imageContainer.appendChild(imagePkmn);
            article.appendChild(imageContainer);

            const infoBg = document.createElement("DIV");
            infoBg.classList.add("bg-black", "h-24", "text-white");

            const infoContainer = document.createElement("DIV");
            infoContainer.classList.add("mx-3", "py-1", "flex", "flex-col", "gap-2");

            const pokemonData = document.createElement("DIV");
            pokemonData.classList.add("flex", "items-center", "gap-2", "justify-center");

            const pokemonSpan = document.createElement("SPAN");
            pokemonSpan.classList.add("font-bold", "text-3xl");
            pokemonSpan.textContent = `#${id}`;

            const pokemonName = document.createElement("P");
            pokemonName.classList.add("font-bold", "text-3xl");
            pokemonName.textContent = name.toUpperCase();

            const typeContainer = document.createElement("DIV");
            typeContainer.classList.add("flex", "justify-evenly", "uppercase");

            tipos.forEach(tipo => {
                const typeInfo = document.createElement("P");
                typeInfo.classList.add("w-24", "rounded-2xl", "px-4", "py-1", "text-white", "font-bold", "text-center", "outline-2");
                typeInfo.textContent = tipo;
                typeInfo.style.backgroundColor = typeColors[tipo] || "#FFD700";
                typeContainer.appendChild(typeInfo);
            });

            infoBg.appendChild(infoContainer);
            pokemonData.appendChild(pokemonSpan);
            pokemonData.appendChild(pokemonName);
            infoContainer.appendChild(pokemonData);
            infoContainer.appendChild(typeContainer);
            article.appendChild(infoBg);
            pkmnContainer.appendChild(article);
        });
    }

    async function searchAPI(e, type) {
        let pokemon;
        if (type === "name") {
            pokemon = e.target.elements["pokemonName"].value;
        } else {
            pokemon = e.target.elements["pokemonNumber"].value;
        }
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`;

        try {
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            construirPokemon([resultado]);
        } catch (error) {
            console.log(error);
        }
    }
});
