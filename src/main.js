window.addEventListener("DOMContentLoaded", async () => {
    const pkmnContainer = document.getElementById("pkmns-container");
    const formNumber = document.querySelector("#form-number");
    const formName = document.querySelector("#form-name");
    const typeFilter = document.querySelector("#type-filter");
    const typeNav = document.querySelector("#types-nav");
    const typeIcon = document.querySelector("#typeIcon");
    const navGens = document.querySelectorAll(".navGens");    
   

    const regions = {
        kanto:  { start: 1,   end: 151 },
        johto:  { start: 152, end: 251 },
        hoenn:  { start: 252, end: 386 },
        sinnoh: { start: 387, end: 493 },
        unova:  { start: 494, end: 649 },
        kalos:  { start: 650, end: 721 },
        alola:  { start: 722, end: 809 },
        galar:  { start: 810, end: 898 },
        hisui:  { start: 899, end: 905 },
        paldea: { start: 906, end: 1025 }
    };

    const typeColors = {
        normal:   "#A8A77A", fire:    "#EE8130", water:   "#6390F0",
        electric: "#F7D02C", grass:   "#7AC74C", ice:     "#96D9D6",
        fighting: "#C22E28", poison:  "#A33EA1", ground:  "#E2BF65",
        flying:   "#A98FF3", psychic: "#F95587", bug:     "#A6B91A",
        rock:     "#B6A136", ghost:   "#735797", dragon:  "#6F35FC",
        dark:     "#705746", steel:   "#B7B7CE", fairy:   "#D685AD"
    };

    let region = "kanto"; // default
    let lastRegion = "kanto";
    let activeType;

    

    navGens.forEach(link => {
        link.addEventListener("click", (e) => {
            const changeRegion = e.target.id;
            renderRegion(changeRegion);
        });
    });

    if (!pkmnContainer.firstChild) {
        renderRegion(region);
    };

    typeFilter.addEventListener("click", () => {
        if (typeNav.classList.contains("nav-hidden")) {
            typeNav.classList.remove("nav-hidden");
            typeNav.classList.add("nav-visible");
            typeIcon.classList.add("rotate-180");
        } else if (typeNav.classList.contains("nav-visible")) {
            typeNav.classList.remove("nav-visible");
            typeNav.classList.add("ocultar-anim");
            typeIcon.classList.remove("rotate-180");
            setTimeout(() => {
                typeNav.classList.add("nav-hidden");
            }, 200);
        };
    });

    formNumber.addEventListener("submit", async (e) => {
        e.preventDefault();
        searchAPI(e, "number");
    });

    formName.addEventListener("submit", async (e) => {
        e.preventDefault();
        searchAPI(e, "name");
    });

    async function renderRegion(regionName, pokemonCallForLotes = 20) {
        pkmnContainer.innerHTML = "";

        const actualRegion = document.querySelector(`#${regionName}`);

        if (regionName !== lastRegion) {
            const deleteColor = document.querySelector(`#${lastRegion}`);
            deleteColor.classList.remove("bg-yellow-500");
            deleteColor.classList.add("bg-white");
            actualRegion.classList.add("bg-yellow-500");
            actualRegion.classList.remove("bg-white");
        } else {
            actualRegion.classList.add("bg-yellow-500");
            actualRegion.classList.remove("bg-white");
        };

        lastRegion = actualRegion.id;

        const { start, end } = regions[regionName];
        const ids = [];
        for (let i = start; i <= end; i++) ids.push(i);

        let pokemons = [];

        for (let i = 0; i < ids.length; i += pokemonCallForLotes) {
            const groupPokemon = ids.slice(i, i + pokemonCallForLotes);
            const batchFetches = groupPokemon.map(id =>
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(res => res.json())
            );
            try {
                const batchResults = await Promise.all(batchFetches);
                pokemons = pokemons.concat(batchResults);
                construirPokemon(pokemons);
            } catch (error) {
                console.error("Error al consultar la API:", error);
            };
        };
    };

    function construirPokemon(pokemonArray, shiny) {
        pkmnContainer.innerHTML = "";

        pokemonArray.forEach(pokemon => {
            const { sprites: { front_default }, id, name, types } = pokemon;

            const colorApi = types[0].type.name;
            const colorBg = typeColors[colorApi] || "#FFFFFF";
             
            const tipos = types.map(t => t.type.name);

            const article = document.createElement("ARTICLE");
            article.classList.add(
                "rounded-4xl", "overflow-hidden", "shadow-xl", "w-full", "border-4",
                "hover:-translate-y-1", "transition", "cursor-pointer", "z-10"
            );
            article.setAttribute("id", id);

            const imageContainer = document.createElement("DIV");
            imageContainer.classList.add(
                "h-60", "relative", "flex", "items-center", "justify-center",
                "bg-cover", "bg-center", "bg-white"
            );

            const imageBg = document.createElement("IMG");
            imageBg.src = "./src/img/Pokeball.webp";
            imageBg.alt = "Pokeball background";
            imageBg.classList.add(
                "absolute", "inset-0", "w-full", "h-full", "object-cover",
                "opacity-20", "pointer-events-none", "select-none"
            );

            const imagePkmn = document.createElement("IMG");
            imagePkmn.src = front_default;
            imagePkmn.alt = name;
            imagePkmn.classList.add("relative", "z-10", "opacity-100", "size-28");

            imageContainer.appendChild(imageBg);
            imageContainer.appendChild(imagePkmn);
            article.appendChild(imageContainer);

            const overlay = document.createElement("DIV");
                overlay.style.position = "absolute";
                overlay.style.inset = "0";
                overlay.style.background = "rgba(0,0,0,0.1)"; //Ajustar la opacidad
                overlay.style.zIndex = "1";

            // Agrega eventos para animar la imagen al pasar el mouse
            article.addEventListener("mouseenter", () => {
                imagePkmn.classList.add("pokemon-bounce");
                imageContainer.style.backgroundColor = colorBg;
                imageContainer.appendChild(overlay);
            });
            article.addEventListener("mouseleave", () => {
                imagePkmn.classList.remove("pokemon-bounce");
                imageContainer.style.backgroundColor = "#FFFFFF";
                imageContainer.removeChild(overlay);
            });

            const infoBg = document.createElement("DIV");
            infoBg.classList.add("bg-black", "h-32", "text-white", "flex", "flex-col", "justify-center");

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
                typeInfo.classList.add(
                    "w-24", "rounded-2xl", "px-4", "py-1", "text-white",
                    "font-bold", "text-center", "outline-2"
                );
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

            if (pokemonArray.length === 1) {
                article.classList.add("max-w-md", "mx-auto");
                pkmnContainer.classList.remove("md:grid-cols-2", "xl:grid-cols-3");
            } else {
                pkmnContainer.classList.add("md:grid-cols-2", "xl:grid-cols-3", "row-span-3");
            }
        });
    };

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
        };
    };
});