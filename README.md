## Van Gogh Invaders

Van Gogh Invaders is Space Invaders meets Vincent Van Gogh.  

Evil sunflowers are invading the earth and it is up to Van Gogh to save the day.  
He utilizes his trusty paint brushes to take out the aliens, while dodging their bombs.  

The game is set against the background of his painting, Starry Night.  

Use the arrow keys to navigate and the space bar to shoot.  Avoid the bombs, take out the invaders.  

![game](assets/game.png)

### State  

The game employees for different states.  The initial background state,
a level screen, a game state, and the game over state.  Event listeners help
navigate through the various states, generally waiting for a space bar click.  
Although in the game state, it is left when lives equal zero or the aliens touch
Van Gogh.  

![start](assets/start.png)


## Code

Stars twinkle by choosing colors at random every time they re-render:

![code1](assets/code1.png)

Sunflowers alternate between two images (space invader style) through a boolean that checks Date.now.
I set this up because switching images in the render would be too quick of a timeframe.   

![code2](assets/code2.png)

![code3](assets/code3.png)


### Technology

- Vanilla JavaScript is used for overall structure and game logic.
- `HTML5 Canvas` is used for DOM manipulation and rendering.
- setInterval is used for the animation.


### Future implementation

- Build a few levels, maybe a bonus level where Van Gogh collects paint brushes
- Possibly create a few algorithm visualizations that mimic the starry night skies to add into the game.  
