import { Drink } from './drink';
import { VolumeUnit } from './unit';

describe('Drink', () => {
  describe('#alcoholUnits', () => {
    it('should calculate units correctly when using metric', () => {
      const drink = new Drink(568, VolumeUnit.Milliliters, 5.2);

      expect(drink.alcoholUnits).toBeCloseTo(2.95, 2);
    });
    it('should calculate units correctly when using imperial', () => {
      const drink = new Drink(12, VolumeUnit.Ounces, 7.9);

      expect(drink.alcoholUnits).toBeCloseTo(2.8, 2);
    });
  });
});