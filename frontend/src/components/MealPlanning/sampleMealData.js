import { getCurrentDateFormatted } from "./dateFormatter";

// Sample meal data structure
const sampleMealData = {
    startDate: '2025-04-8',
    tuesday: {
      meals:[
          { title: '', image: '' },
          { title: '', image: '' },
          { title: '', image: '' }
      ],
      nutrients:{
          "calories": 2003.28,
          "protein": 123.23,
          "fat": 147.31,
          "carbohydrates": 49.37
      }
    },
    wednesday: {
        meals:[
            { title: '', image: '' },
            { title: '', image: '' },
            { title: '', image: '' }
        ],
        nutrients:{
            "calories": 2003.28,
            "protein": 123.23,
            "fat": 147.31,
            "carbohydrates": 49.37
        }
    },
    thursday: {
      meals:[
          { title: 'Chicken Caesar Salad', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
          { 
              title: 'Coffee & Banana with Peanut Butter', 
              image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' 
          },
          { title: '', image: '' }
      ],
      nutrients:{
          "calories": 2003.28,
          "protein": 123.23,
          "fat": 147.31,
          "carbohydrates": 49.37
      }
    },
    friday: {
      meals:[
          { title: '', image: '' },
          { title: '', image: '' },
          { title: '', image: '' }
      ],
      nutrients:{
          "calories": 2003.28,
          "protein": 123.23,
          "fat": 147.31,
          "carbohydrates": 49.37
      }
    },
    saturday: {
      meals:[
          { title: '', image: '' },
          { title: '', image: '' },
          { title: '', image: '' }
      ],
      nutrients:{
          "calories": 2003.28,
          "protein": 123.23,
          "fat": 147.31,
          "carbohydrates": 49.37
      }
    },
    sunday: {
      meals:[
          { title: '', image: '' },
          { title: '', image: '' },
          { title: '', image: '' }
      ],
      nutrients:{
          "calories": 2003.28,
          "protein": 123.23,
          "fat": 147.31,
          "carbohydrates": 49.37
      }
    },
    monday: {
      meals:[
          { title: '', image: '' },
          { title: '', image: '' },
          { title: '', image: '' }
      ],
      nutrients:{
          "calories": 2003.28,
          "protein": 123.23,
          "fat": 147.31,
          "carbohydrates": 49.37
      }
    },
  };

const samplePlanList = [{startDate:'2025-03-30',time:"week",id:1},{startDate:'2025-03-31',time:"day",id:2},{startDate:'2025-04-05',time:"week",id:3},{startDate:'2025-03-30',time:"day",id:4}];

const sampleMeals = {
    "meals": [
    {
        "id": 622598,
        "image": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
        "imageType": "jpg",
        "title": "Pittata - Pizza Frittata",
        "readyInMinutes": 30,
        "servings": 2,
        "sourceUrl": "https://spoonacular.com/-1418233867224"
    },
    {
        "id": 661126,
        "image": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
        "imageType": "jpg",
        "title": "Spicy Lump Crab and Avocado Salad",
        "readyInMinutes": 30,
        "servings": 4,
        "sourceUrl": "https://www.foodista.com/recipe/2F6R3J76/spicy-lump-crab-and-avocado-salad"
    },
    {
        "id": 661948,
        "image": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
        "imageType": "jpg",
        "title": "Strip steak with roasted cherry tomatoes and vegetable mash",
        "readyInMinutes": 45,
        "servings": 4,
        "sourceUrl": "https://www.foodista.com/recipe/BS5TFNHL/striploin-steak-with-roasted-cherry-tomatoes-and-vegetable-mash"
    }
    ],
    "nutrients": {
    "calories": 2003.28,
    "protein": 123.23,
    "fat": 147.31,
    "carbohydrates": 49.37
    }
  }
  


export default sampleMealData;
export { samplePlanList };
export { sampleMeals };