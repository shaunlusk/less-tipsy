import { ActiveSession } from './active-session';
import { Drink } from './drink';
import { VolumeUnit } from './unit';

describe('ActiveSession', () => {
  describe('#unitsConsumed', () => {
    it('should report units consumed accurately', () => {
      const session = new ActiveSession(4, 14, 3, 2);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      session.addDrink(new Drink(12, VolumeUnit.Ounces, 7.9));

      expect(session.unitsConsumed).toBeCloseTo(5.757, 3);
    });
  });
  describe('#sessionRemaining', () => {
    it('should correctly show units remaining', () => {
      const session = new ActiveSession(4, 14, 3, 2);
      session.addDrink(new Drink(200, VolumeUnit.Milliliters, 5));
      
      expect(session.sessionRemaining).toBeCloseTo(3, 2);
    });
    it('should correctly show no units remaining', () => {
      const session = new ActiveSession(1, 14, 3, 2);
      session.addDrink(new Drink(400, VolumeUnit.Milliliters, 5));
      
      expect(session.sessionRemaining).toBeCloseTo(0, 1);
    });
  });
  describe('#hourlyRate', () => {
    it('should calculate hourly rate on immediate drink', () => {
      const session = new ActiveSession(4, 14, 3, 2);
      session.addDrink(new Drink(400, VolumeUnit.Milliliters, 5));
  
      expect(session.hourlyRate).toBeCloseTo(2, 2);
    });
    it('should return 0 if no drinks', () => {
      const session = new ActiveSession(4, 14, 3, 2);
  
      expect(session.hourlyRate).toBe(0);
    });
    it('should calc hourly rate on deferred drinks 1', () => {
      const session = new ActiveSession(4, 14, 3, 2);
      const hourAgo = new Date(Date.now() - (1000 * 60 * 60));
      session.addDrink(new Drink(400, VolumeUnit.Milliliters, 5, hourAgo));
      session.addDrink(new Drink(600, VolumeUnit.Milliliters, 5));

      expect(session.hourlyRate).toBeCloseTo(2, 2);
    });
    it('should calc hourly rate on deferred drinks 1', () => {
      const session = new ActiveSession(4, 14, 3, 2);
      const twoHoursAgo = new Date(Date.now() - (2 * 1000 * 60 * 60));
      const hourAgo = new Date(Date.now() - (1000 * 60 * 60));
      session.addDrink(new Drink(400, VolumeUnit.Milliliters, 5, twoHoursAgo)); // 2 units
      session.addDrink(new Drink(800, VolumeUnit.Milliliters, 5, hourAgo)); // 4 units
      session.addDrink(new Drink(600, VolumeUnit.Milliliters, 5));  // 3 units

      expect(session.hourlyRate).toBeCloseTo(2.57, 2);
    });
  });
  describe('#rollingWeeklyTotal', () => {
    it('should reflect drinks added', () => {
      const session = new ActiveSession(4, 14, 3, 2);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      
      expect(session.rollingWeeklyTotal).toBeCloseTo(3 + 2.95, 2);
    });
  });
  describe('#rollingWeeklyRemaining', () => {
    it('should calculate correctly', () => {
      const session = new ActiveSession(4, 14, 3, 2);
      session.addDrink(new Drink(400, VolumeUnit.Milliliters, 5));
      
      expect(session.rollingWeeklyRemaining).toBeCloseTo(9, 2);
    });
  });
  describe('#isSessionOk', () => {
    it('should be ok', () => {
      const session = new ActiveSession(4, 14, 3, 2);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      
      expect(session.isSessionOk).toBeTruthy();
    });
    it('should not be ok', () => {
      const session = new ActiveSession(2, 14, 3, 2);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      
      expect(session.isSessionOk).toBeFalsy();
    });
  });
  describe('#isWeeklyOk', () => {
    it('should be ok', () => {
      const session = new ActiveSession(4, 14, 3, 2);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      
      expect(session.isWeeklyOk).toBeTruthy();
    });
    it('should not be ok', () => {
      const session = new ActiveSession(2, 5, 3, 2);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      
      expect(session.isWeeklyOk).toBeFalsy();
    });
  });
  describe('#isHourlyRateOk', () => {
    it('should be ok', () => {
      const session = new ActiveSession(4, 14, 3, 3);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      
      expect(session.isHourlyRateOk).toBeTruthy();
    });
    it('should not be ok', () => {
      const session = new ActiveSession(2, 5, 3, 2);
      const hourAgo = new Date(Date.now() - (1000 * 60 * 60));
      session.addDrink(new Drink(600, VolumeUnit.Milliliters, 5, hourAgo));
      session.addDrink(new Drink(400, VolumeUnit.Milliliters, 5));
      
      expect(session.isHourlyRateOk).toBeFalsy();
    });
  });
});