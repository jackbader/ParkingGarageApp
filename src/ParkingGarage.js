const vehicleTypes = require('./utils/vehicleTypes');
const spotTypes = require('./utils/spotTypes');

class ParkingGarage {
  constructor(numOfLevels, rowsPerLevel, spotsPerRow) {
    const newLevels = [];
    const garageInfo = {
      numOfLevels,
      rowsPerLevel,
      spotsPerRow,
    };
    for (let i = 0; i < numOfLevels; i++) {
      newLevels.push(new Level(rowsPerLevel, spotsPerRow, garageInfo, i));
    }
    this.levels = newLevels;
    this.numOfLevels = numOfLevels;
    this.rowsPerLevel = rowsPerLevel;
    this.spotsPerRow = spotsPerRow;
  }

  getSpots() {
    const spots = [];
    this.levels.forEach(level => {
      level.rows.forEach(row => {
        row.spots.forEach(spot => {
          spots.push(spot);
        });
      });
    });
    return spots;
  }

  isRoomForBus(spot) {
    const spots = this.getSpots();
    const {
      spotNumber,
      garageInfo: { spotsPerRow },
    } = spot;
    let consecutiveSpots = 0;

    for (let i = spotNumber - 1; i < spotsPerRow; i--) {
      let spotToLeft = spots[i];
      if (spotToLeft && spotToLeft.type === 'Large') {
        consecutiveSpots += 1;
        continue;
      } else {
        break;
      }
    }

    for (let i = spotNumber - 1; i > spotsPerRow; i++) {
      let spotToRight = spots[i];
      if (spotToRight && spotToRight.type === 'Large') {
        consecutiveSpots += 1;
        continue;
      } else {
        break;
      }
    }

    if (consecutiveSpots >= 4) {
      return true;
    } else {
      return false;
    }
  }

  assignVehicle(spot, vehicle) {
    if (spot.filled) return false;
    if (
      vehicle.type === vehicleTypes.car &&
      spot.type === spotTypes.motorcycle
    ) {
      return false;
    }

    if (vehicle.type === vehicleTypes.bus) {
      if (spot.type === spotTypes.large) {
        if (this.isRoomForBus(spot)) {
          spot.filled = true;
          spot.parkedVehicle = vehicle;
          return true;
        }
      }
    } else {
      spot.filled = true;
      spot.parkedVehicle = vehicle;
      return true;
    }
  }

  park(vehicle) {
    const spots = this.getSpots();

    return spots.some(spot => {
      return this.assignVehicle(spot, vehicle);
    });
  }
}

class Level {
  constructor(rowsPerLevel, spotsPerRow, garageInfo, levelNum) {
    const newRows = [];
    for (let i = 0; i < rowsPerLevel; i++) {
      newRows.push(new Row(spotsPerRow, garageInfo, levelNum, i));
    }
    this.rows = newRows;
  }
}

class Row {
  constructor(spotsPerRow, garageInfo, levelNum, rowInLevel) {
    const newSpots = [];
    for (let i = 0; i < spotsPerRow; i++) {
      newSpots.push(new Spot(garageInfo, levelNum, rowInLevel, i));
    }
    this.spots = newSpots;
  }
}

class Spot {
  constructor(garageInfo, levelNum, rowInLevel, spotInRow) {
    const types = [spotTypes.motorcycle, spotTypes.compact, spotTypes.large];
    const randomInt = Math.floor(Math.random() * types.length);

    const spotNumber =
      levelNum * garageInfo.rowsPerLevel * garageInfo.spotsPerRow +
      rowInLevel * garageInfo.spotsPerRow +
      spotInRow;

    this.spotNumber = spotNumber;
    this.garageInfo = garageInfo;
    this.type = types[randomInt];
    this.filled = false;
    this.parkedVehicle = null;
  }
}

class Vehicle {
  constructor(type) {
    this.type = type;
  }
}

module.exports = {
  ParkingGarage,
  Vehicle,
};
