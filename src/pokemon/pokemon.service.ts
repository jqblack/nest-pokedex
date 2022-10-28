import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {

    try {

      createPokemonDto.name = createPokemonDto.name.toLowerCase()

      const pokemon = await this.PokemonModel.create(createPokemonDto)

      return pokemon

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {

    let pokemon: Pokemon

    if (!isNaN(+term)) {
      pokemon = await this.PokemonModel.findOne({ no: term })
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.PokemonModel.findById(term)
    }

    if (!pokemon) {
      pokemon = await this.PokemonModel.findOne({ name: term.toLocaleLowerCase() })
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name or no ${term} not found`)
    }

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term)

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()
    }

    try {

      await pokemon.updateOne(updatePokemonDto)

      return { ...pokemon.toJSON(), ...updatePokemonDto }

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async remove(id: string) {

    const {deletedCount} = await this.PokemonModel.deleteOne({_id: id})

    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with the ID ${id} not found`)
    }

    return
  }

  private handleExceptions(error: any){
    if (error.code === 11000) {

      throw new BadRequestException(`This pokemon already exist in the database ${JSON.stringify(error.keyValue)}`)
    }

    console.log(error)

    throw new InternalServerErrorException(`Check the console in the backend`)
  }
}
