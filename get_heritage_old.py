from io import StringIO
import json
import pandas as pd
import sys
from marshmallow import Schema, fields, pprint

class Item:
    def __init__(self):
        self.name = "avg"
        self.theme_weght = -1
        self.dating = 0.021135151
        self.violence = 0.118394533
        self.life = 0.121096324
        self.time = 0.057428954
        self.audience = 0.017416271
        self.family = 0.017060131
        self.romantic = 0.048758609
        self.communication = 0.076700245
        self.obscene = 0.09670947
        self.music = 0.060099526
        self.places = 0.047387168
        self.visual = 0.049032521
        self.spiritual = 0.024162994
        self.girls = 0.028054161
        self.sadness = 0.129534733
        self.feelings = 0.031003342
        self.children = []

    # def __iter__(self):
    #     for key in self.some_sequence:
    #         yield (key, 'Value for {}'.format(key))
    # def toJSON(self):
    #     return json.dumps(self, default=lambda o: o.__dict__, indent=4)
class ItemSchema(Schema):
    name = fields.Str()
    theme_weght = fields.Decimal()
    dating = fields.Decimal()
    violence = fields.Decimal()
    life = fields.Decimal()
    time = fields.Decimal()
    audience = fields.Decimal()
    family = fields.Decimal()
    romantic = fields.Decimal()
    communication = fields.Decimal()
    obscene = fields.Decimal()
    music = fields.Decimal()
    places = fields.Decimal()
    visual = fields.Decimal()
    spiritual = fields.Decimal()
    girls = fields.Decimal()
    sadness = fields.Decimal()
    feelings = fields.Decimal()
    children = fields.List(fields.Nested(ItemSchema()))

def getAttributes(row, name):
    item = Item()
    item.name = name
    item.theme_weght = row["theme_weight"]
    item.dating = row["dating"]
    item.violence = row["violence"]
    item.life = row["world/life"]
    item.time = row["night/time"]
    item.audience = row["shake the audience"]
    item.family = row["family/gospel"]
    item.romantic = row["romantic"]
    item.communication = row["communication"]
    item.obscene = row["obscene"]
    item.music = row["music"]
    item.places = row["movement/places"]
    item.visual = row["light/visual perceptions"]
    item.spiritual = row["family/spiritual"]
    item.girls = row["like/girls"]
    item.sadness = row["sadness"]
    item.feelings = row["feelings"]

    return item

# def obj_dict(obj):
#     if isinstance(Item, list):
#         return obj.__dict__
#     else:
#         return obj


# # # # # # # # # # # # # # # # # # # # # # # # # #

main_genre_df = pd.read_csv("datasets/themes_by_main_genre.csv", delimiter=',', encoding=None)
specific_genre_df = pd.read_csv("datasets/themes_by_specific_genre.csv", delimiter=',', encoding=None)
artist_df = pd.read_csv("datasets/themes_by_artist.csv", delimiter=',', encoding=None)

root = Item()

lst = []
lst.append(root)

for index, main_row in main_genre_df.iterrows():
    name = main_row['main_genre']
    main_genre = getAttributes(main_row, name)
    # for specific_row in specific_genre_df.iterrows():
    #     if specific_row["main_genre"] == main_genre.name:
    #         specific_genre = getAttributes(specific_row, specific_row['specific_genre'])
    #         for artist_row in artist_df.iterrows():
    #             if artist_row["specific_genre"] == specific_genre.name:
    #                 artist = getAttributes(artist_row, artist_row['artist_name'])
    #                 specific_genre.children.append(artist)
    #         main_genre.children.append(specific_genre)

    root.children.append(main_row)
    
# jsonStr = json.dumps(lst, default=obj_dict)
# jsonStr = json.dumps(root.__dict__, default=obj_dict)
# jsonStr = json.dumps(root, default=lambda o: o.__dict__, indent=4)
# jsonStr = root.toJSON()
schema = ItemSchema()
result = schema.dump(root)
print(result)

original_stdout = sys.stdout # Save a reference to the original standard output

with open('root.json', 'w') as f:
    sys.stdout = f # Change the standard output to the file we created.
    print(jsonStr)
    sys.stdout = original_stdout

