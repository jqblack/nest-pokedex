import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name, //Este name siempre sera name, eso no tiene que ver con el campo en el entity
        schema: PokemonSchema // El que exportamos al final de entity
      }
    ])
  ]
})
export class PokemonModule {}
