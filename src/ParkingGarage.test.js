/*
 *
 * Parking garage that has multiple levels
 * Levels have rows
 * Rows have spots
 * Vehicle
 * Motorcycle type of vehicle
 * Car type of vehicle
 * Bus type of vehicle
 * Spot has a filled property
 * A motorcycle can park in any spot
 * A car can park in a single spot or a large spot
 * A bus can park in five large spots that are consecutive and in the same row
 *
 */

const { expect } = require('chai');
const { stub } = require('sinon');

const spotTypes = require('./utils/spotTypes');
const { ParkingGarage } = require('./ParkingGarage');
const { Vehicle } = require('./ParkingGarage');

describe('ParkingGarage', () => {
  let LargeParkingGarage;
  let SmallParkingGarage;
  const motorcycle = new Vehicle('Motorcycle');
  const car = new Vehicle('Car');
  let mockCompactSpot;
  let mockLargeSpot;
  let mockMotorcycleSpot;
  const mockGarageInfo = {
    spotsPerRow: 5,
  };

  beforeEach(() => {
    LargeParkingGarage = new ParkingGarage(3, 5, 10);
    SmallParkingGarage = new ParkingGarage(1, 2, 5);
    mockLargeSpot = {
      type: spotTypes.large,
    };
    mockMotorcycleSpot = {
      type: spotTypes.motorcycle,
    };
    mockCompactSpot = {
      type: spotTypes.compact,
    };
  });

  it('has multiple levels', () => {
    expect(LargeParkingGarage.levels.length).to.equal(3);
  });

  it('levels should have rows', () => {
    expect(LargeParkingGarage.levels[0].rows.length).to.equal(5);
  });

  it('rows should have spots', () => {
    expect(LargeParkingGarage.levels[0].rows[0].spots.length).to.equal(10);
  });

  it('a motorcycle can park in a compact spot', () => {
    const mockSpot = {
      type: spotTypes.compact,
    };
    expect(LargeParkingGarage.assignVehicle(mockSpot, motorcycle)).to.equal(
      true
    );
  });

  it('a motorcycle can park in a large spot', () => {
    expect(
      LargeParkingGarage.assignVehicle(mockLargeSpot, motorcycle)
    ).to.equal(true);
  });

  it('a motorcycle can park in a motorcycle spot', () => {
    expect(
      LargeParkingGarage.assignVehicle(mockMotorcycleSpot, motorcycle)
    ).to.equal(true);
  });

  it('a car can park in compact spot', () => {
    expect(LargeParkingGarage.assignVehicle(mockCompactSpot, car)).to.equal(
      true
    );
  });

  it('a car can park in large spot', () => {
    expect(LargeParkingGarage.assignVehicle(mockLargeSpot, car)).to.equal(true);
  });

  it('a car cannot park in motorcycle spot', () => {
    expect(LargeParkingGarage.assignVehicle(mockMotorcycleSpot, car)).to.equal(
      false
    );
  });

  it('can park a bus if the garage has a row with 5 large spaces next to eachother', () => {
    const mockSpots = [
      { type: spotTypes.compact, spotNumber: 0, garageInfo: mockGarageInfo },
      { type: spotTypes.compact, spotNumber: 1, garageInfo: mockGarageInfo },
      { type: spotTypes.large, spotNumber: 2, garageInfo: mockGarageInfo },
      { type: spotTypes.compact, spotNumber: 3, garageInfo: mockGarageInfo },
      { type: spotTypes.compact, spotNumber: 4, garageInfo: mockGarageInfo },
      { type: spotTypes.large, spotNumber: 5, garageInfo: mockGarageInfo },
      { type: spotTypes.large, spotNumber: 6, garageInfo: mockGarageInfo },
      { type: spotTypes.large, spotNumber: 7, garageInfo: mockGarageInfo },
      { type: spotTypes.large, spotNumber: 8, garageInfo: mockGarageInfo },
      { type: spotTypes.large, spotNumber: 9, garageInfo: mockGarageInfo },
    ];
    stub(SmallParkingGarage, 'getSpots').callsFake(() => mockSpots);
    const bus = new Vehicle('Bus');
    expect(SmallParkingGarage.park(bus)).to.equal(true);
  });

  it('is not allowed to park a bus if the garage does not have a row with 5 consecutive large spots', () => {
    const mockSpots = [
      { type: spotTypes.compact, spotNumber: 0, garageInfo: mockGarageInfo },
      { type: spotTypes.compact, spotNumber: 1, garageInfo: mockGarageInfo },
      { type: spotTypes.large, spotNumber: 2, garageInfo: mockGarageInfo },
      { type: spotTypes.compact, spotNumber: 3, garageInfo: mockGarageInfo },
      { type: spotTypes.compact, spotNumber: 4, garageInfo: mockGarageInfo },
      { type: spotTypes.large, spotNumber: 5, garageInfo: mockGarageInfo },
      { type: spotTypes.large, spotNumber: 6, garageInfo: mockGarageInfo },
      { type: spotTypes.compact, spotNumber: 7, garageInfo: mockGarageInfo },
      { type: spotTypes.large, spotNumber: 8, garageInfo: mockGarageInfo },
      { type: spotTypes.large, spotNumber: 9, garageInfo: mockGarageInfo },
    ];
    stub(SmallParkingGarage, 'getSpots').callsFake(() => mockSpots);
    const bus = new Vehicle('Bus');
    expect(SmallParkingGarage.park(bus)).to.equal(false);
  });
});
