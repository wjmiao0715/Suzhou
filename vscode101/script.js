// Sample recipes to populate initially
const sampleRecipes = [
    {
        name: "Chocolate Chip Cookies",
        description: "Classic homemade cookies with semi-sweet chocolate chips, perfect for any occasion. Soft, chewy, and absolutely delicious!",
        isFavorite: true
    },
    {
        name: "Spaghetti Carbonara",
        description: "Traditional Italian pasta dish made with eggs, cheese, pancetta, and black pepper. Creamy and savory without any cream.",
        isFavorite: false
    },
    {
        name: "Vegetable Stir Fry",
        description: "Quick and healthy Asian-inspired dish with colorful vegetables, garlic, ginger, and soy sauce served over rice.",
        isFavorite: false
    },
    {
        name: "Chocolate Brownies",
        description: "Fudgy, decadent brownies loaded with chocolate. Perfect as a dessert or treat with a cup of coffee.",
        isFavorite: true
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadRecipes();
    setupEventListeners();
});

// Setup form submission
function setupEventListeners() {
    const form = document.getElementById('recipeForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addRecipe();
    });
}

// Add a new recipe
function addRecipe() {
    const nameInput = document.getElementById('recipeName');
    const descriptionInput = document.getElementById('recipeDescription');

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!name || !description) {
        alert('Please fill in all fields');
        return;
    }

    // Get existing recipes from localStorage
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // Add new recipe
    recipes.push({
        name: name,
        description: description,
        id: Date.now()
    });

    // Save to localStorage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Clear form
    nameInput.value = '';
    descriptionInput.value = '';

    // Refresh display
    displayRecipes(recipes);
}

// Load recipes from localStorage or use samples
function loadRecipes() {
    let recipes = JSON.parse(localStorage.getItem('recipes'));

    // If no recipes stored, use sample recipes
    if (!recipes || recipes.length === 0) {
        recipes = sampleRecipes.map((recipe, index) => ({
            ...recipe,
            id: Date.now() + index
        }));
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    displayRecipes(recipes);
}

// Display recipes on the page
function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';

    if (recipes.length === 0) {
        recipeList.innerHTML = '<div class="empty-message">No recipes yet. Add one to get started!</div>';
        return;
    }

    // Sort recipes: favorites first, then others
    const sortedRecipes = [...recipes].sort((a, b) => {
        if (a.isFavorite === b.isFavorite) return 0;
        return a.isFavorite ? -1 : 1;
    });

    sortedRecipes.forEach(recipe => {
        const li = document.createElement('li');
        li.className = `recipe-item ${recipe.isFavorite ? 'favorite' : ''}`;
        
        const starClass = recipe.isFavorite ? 'filled' : 'empty';
        const starSymbol = recipe.isFavorite ? '★' : '☆';
        
        li.innerHTML = `
            <div class="recipe-content">
                <div class="recipe-name">
                    <button class="favorite-star ${starClass}" onclick="toggleFavorite(${recipe.id})" title="Add to favorites">
                        ${starSymbol}
                    </button>
                    ${escapeHtml(recipe.name)}
                </div>
                <div class="recipe-description">${escapeHtml(recipe.description)}</div>
            </div>
            <div class="btn-actions">
                <button class="btn-delete" onclick="deleteRecipe(${recipe.id})">Delete</button>
            </div>
        `;
        recipeList.appendChild(li);
    });
}

// Delete a recipe
function deleteRecipe(id) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes = recipes.filter(recipe => recipe.id !== id);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        displayRecipes(recipes);
    }
}

// Toggle favorite status for a recipe
function toggleFavorite(id) {
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes = recipes.map(recipe => {
        if (recipe.id === id) {
            recipe.isFavorite = !recipe.isFavorite;
        }
        return recipe;
    });
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes(recipes);
}

// Helper function to escape HTML and prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
