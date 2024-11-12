const { registerController } = require('../../controllers/register.controller');
const { User } = require('../../models/user');

// Mocks the entire User model, https://jestjs.io/docs/es6-class-mocks#automatic-mock
jest.mock('../../models/user');

describe('RegisterController', () => {
  describe('validateInput', () => {
    it('should throw error if input is empty', async () => {
      await expect(async () => await registerController()).rejects.toThrow('Invalid input');
    });

    it('should throw error if name is too long', async () => {
      const input = { name: 'too long string', email: 'test@test.com', password: '12345678' };
      await expect(async () => await registerController(input)).rejects.toThrow('Invalid name');
    });

    it('should throw error if email is not an email', async () => {
      const input = { name: 'test', email: 'test', password: '12345678' };
      await expect(async () => await registerController(input)).rejects.toThrow('Invalid email');
    });

    it('should throw error if password is too short', async () => {
      const input = { name: 'test', email: 'test@test.com', password: 'short' };
      await expect(async () => await registerController(input)).rejects.toThrow('Invalid password');
    });
  });

  describe('emailShouldNotBeDuplicated', () => {
    it('should throw error email is duplicated', async () => {
      const anotherUser = {},
        input = { name: 'test', email: 'test@test.com', password: '12345678' };

      const spy = jest.spyOn(User, 'findOne').mockResolvedValue(anotherUser);

      await expect(async () => await registerController(input)).rejects.toThrow('Duplicated email');
      expect(spy).toHaveBeenNthCalledWith(1, { email: 'test@test.com' });
    });
  });

  describe('createUser', () => {
    it('should return the saved user', async () => {
      const input = { name: 'test', email: 'test@test.com', password: '12345678' },
        savedUser = { _id: '6194c137a8ebb53ab459cf41', ...input },
        userInstance = { ...input, save: jest.fn().mockResolvedValue(savedUser) };

      const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(null);
      const constructorSpy = User.mockImplementation(() => userInstance);

      const user = await registerController(input);

      expect(findOneSpy).toHaveBeenNthCalledWith(1, { email: 'test@test.com' });
      expect(constructorSpy).toHaveBeenCalledTimes(1, input);
      expect(userInstance.save).toHaveBeenCalledTimes(1);
      expect(user).toBeDefined();
      expect(user._id).toEqual(savedUser._id);
      expect(user.name).toEqual(savedUser.name);
      expect(user.email).toEqual(savedUser.email);
      expect(user.password).toEqual(savedUser.password);
    });
  });
});
