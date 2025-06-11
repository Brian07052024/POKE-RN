const url = `https://pokeapi.co/api/v2`;

export async function viewPokemon(id) {
    try {
        const [resultado, pokedexEntrada] = await Promise.all([
            fetch(`${url}/pokemon/${id}`),
            fetch(`${url}/pokemon-species/${id}`)
        ]);
        const stats = await resultado.json();
        const description = await pokedexEntrada.json();
        return { stats, description };
    } catch (error) {
        console.log(error);
    }
}

