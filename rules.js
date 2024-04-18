var hasMainDoorKey = false;
var isExitUnlocked = false;

var flags = {};

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];

        if(locationData.States) {
            var keys = Object.keys(locationData.States);
            var found = false;
            for(var i = 0; i < keys.length; i++) {
                if(keys[i] != "_" && flags[keys[i]]) {
                    locationData = locationData.States[keys[i]];
                    found = true;
                    break;
                }
            }
            if(!found) {
                locationData = locationData.States["_"];
            }
        }

        if(locationData.Set) {
            flags[locationData.Set] = true;
        }

        this.engine.show(locationData.Body);

        if(locationData.Choices) {
            for(let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        }
    }

    handleChoice(choice) {
        if(choice.Set) {
            flags[choice.Set] = true;
        }
        this.engine.show("&gt; "+choice.Text);
        this.engine.gotoScene(Location, choice.Target);
    }
}

class MainRoomDoor extends Scene {
    create() {
        if(hasMainDoorKey) {
            this.engine.show("You open the door, it leads to a long hallway.");
            this.engine.addChoice("Enter the hallway", true);
        } else {
            this.engine.show("The door is locked.");
        }
        this.engine.addChoice("Look around the room", false);
    }

    handleChoice(enterHallway) {
        if(enterHallway) {
            this.engine.show("&gt; Enter the hallway");
            this.engine.gotoScene(Location, "Hallway");
        } else {
            this.engine.show("&gt; Look around the room");
            this.engine.gotoScene(Location, "MainRoom")
        }
    }
}

class CheckTrash extends Scene {
    create() {
        if(hasMainDoorKey) {
            this.engine.show("You look in the trash can, it's empty.");
        } else {
            this.engine.show("You look in the trash can, there's a key inside, you pick it up.");
            hasMainDoorKey = true;
        }
        this.engine.addChoice("Look around the room");
    }

    handleChoice() {
        this.engine.show("&gt; Look around the room");
        this.engine.gotoScene(Location, "MainRoom")
    }
}

class ControlRoomButton extends Scene {
    create() {
        this.engine.show("<hr>");
    }
}

class ExitDoor extends Scene {
    create() {
        this.engine.show("<hr>");
    }
}

Engine.load(Start, 'myStory.json');