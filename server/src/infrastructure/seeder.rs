// src/infrastructure/seeder.rs
use sea_orm::PaginatorTrait;
use sea_orm::{DatabaseConnection, TransactionTrait, Set, ActiveModelTrait, EntityTrait};
use uuid::Uuid;
use crate::domain::entities::{tag, ingredient, recipe, recipe_ingredient, recipe_tag};
use crate::infrastructure::error::AppError;

// Constants
const TAGS: &[(&str, Option<&str>)] = &[
    ("Easy", None),
    ("Quick", Some("4d4daf5e-7b4b-11ec-90d6-0242ac120004")),
    ("Healthy", Some("4d4daf5e-7b4b-11ec-90d6-0242ac120005")),
    ("Popular", Some("4d4daf5e-7b4b-11ec-90d6-0242ac120006")),
    ("Classic", Some("4d4daf5e-7b4b-11ec-90d6-0242ac120007")),
    ("Vegan", None),
    ("Vegetarian", Some("2a2baf5e-7b4b-11ec-90d6-0242ac120004")),
    ("Desserts", Some("2a2baf5e-7b4b-11ec-90d6-0242ac120005")),
    ("Main Course", Some("2a2baf5e-7b4b-11ec-90d6-0242ac120006")),
    ("Appetizers", Some("2a2baf5e-7b4b-11ec-90d6-0242ac120007")),
];

const INGREDIENTS: &[&str] = &[
    "Eier", "Milch", "Mehl", "Zucker", "Salz", "Butter", "Hühnchenfilet",
    "Stärke", "Sojasauce", "Knoblauch", "Pfeffer", "Öl", "Reis", "Zwiebel",
    "Backpulver", "Kartoffeln", "Paniermehl", "Paprika", "Käse", "Schinken",
    "Vanillinzucker", "Puderzucker", "Zitronensaft", "Mascarpone", "Espresso",
    "Amaretto", "Löffelbisquit", "Kakaopulver", "Nudeln", "Lachs", "Spinat",
    "Sahne", "Mozzarella", "Geriebener Käse"
];

pub async fn should_seed(db: &DatabaseConnection) -> Result<bool, Box<dyn std::error::Error>> {
    let recipe_count = recipe::Entity::find().count(db).await?;
    let tag_count = tag::Entity::find().count(db).await?;
    let ingredient_count = ingredient::Entity::find().count(db).await?;

    Ok(recipe_count == 0 || tag_count == 0 || ingredient_count == 0)
}

pub async fn seed_all(db: &DatabaseConnection) -> Result<(), AppError> {
    println!("Seeding database...");

    let tag_ids = seed_or_fetch_tags(db).await?;
    let ingredient_ids = seed_or_fetch_ingredients(db).await?;

    let recipe_count = recipe::Entity::find().count(db).await?;
    if recipe_count == 0 {
        seed_recipes(db, &tag_ids, &ingredient_ids).await?;
    } else {
        println!("  ⊘ Recipes already exist, skipping");
    }

    println!("✓ Seeding completed!");
    Ok(())
}

async fn seed_or_fetch_tags(db: &DatabaseConnection) -> Result<Vec<Uuid>, AppError> {
    use std::collections::HashMap;

    let existing_tags = tag::Entity::find().all(db).await?;
    let tag_map: HashMap<String, Uuid> = existing_tags.iter()
        .map(|t| (t.name.clone(), t.id))
        .collect();

    let mut tag_ids = Vec::new();
    let mut seeded_count = 0;

    for (name, uuid_str) in TAGS {
        if let Some(&existing_id) = tag_map.get(*name) {
            tag_ids.push(existing_id);
        } else {
            let id = match uuid_str {
                Some(s) => Uuid::parse_str(s).unwrap(),
                None => Uuid::now_v7()
            };

            let tag = tag::ActiveModel {
                id: Set(id),
                name: Set(name.to_string()),
            };

            tag.insert(db).await?;
            tag_ids.push(id);
            seeded_count += 1;
        }
    }

    if seeded_count > 0 {
        println!("  ✓ {} Tags (seeded {} new)", tag_ids.len(), seeded_count);
    } else {
        println!("  ⊘ {} Tags (all existed)", tag_ids.len());
    }

    Ok(tag_ids)
}

async fn seed_or_fetch_ingredients(db: &DatabaseConnection) -> Result<Vec<Uuid>, AppError> {
    use std::collections::HashMap;

    let existing_ingredients = ingredient::Entity::find().all(db).await?;
    let ingredient_map: HashMap<String, Uuid> = existing_ingredients.iter()
        .map(|i| (i.name.clone(), i.id))
        .collect();

    let mut ingredient_ids = Vec::new();
    let mut seeded_count = 0;

    for name in INGREDIENTS {
        if let Some(&existing_id) = ingredient_map.get(*name) {
            ingredient_ids.push(existing_id);
        } else {
            let id = Uuid::now_v7();

            let ingredient = ingredient::ActiveModel {
                id: Set(id),
                name: Set(name.to_string()),
            };

            ingredient.insert(db).await?;
            ingredient_ids.push(id);
            seeded_count += 1;
        }
    }

    if seeded_count > 0 {
        println!("  ✓ {} Ingredients (seeded {} new)", ingredient_ids.len(), seeded_count);
    } else {
        println!("  ⊘ {} Ingredients (all existed)", ingredient_ids.len());
    }

    Ok(ingredient_ids)
}

async fn seed_recipes(
    db: &DatabaseConnection,
    tag_ids: &[Uuid],
    ingredient_ids: &[Uuid]
) -> Result<(), AppError> {
    seed_zebrakuchen(db, tag_ids, ingredient_ids).await?;
    seed_crepe(db, tag_ids, ingredient_ids).await?;
    seed_fried_chicken(db, tag_ids, ingredient_ids).await?;
    seed_schnitzel(db, tag_ids, ingredient_ids).await?;
    seed_omelette(db, tag_ids, ingredient_ids).await?;
    seed_tiramisu(db, tag_ids, ingredient_ids).await?;
    seed_lachs_auflauf(db, tag_ids, ingredient_ids).await?;

    println!("  ✓ 7 Recipes");
    Ok(())
}

async fn seed_zebrakuchen(
    db: &DatabaseConnection,
    tag_ids: &[Uuid],
    ingredient_ids: &[Uuid]
) -> Result<(), AppError> {
    let txn = db.begin().await?;
    let recipe_id = Uuid::parse_str("8a8baf5e-7b4b-11ec-90d6-0242ac120004").unwrap();

    let recipe = recipe::ActiveModel {
        id: Set(recipe_id),
        name: Set("Zebrakuchen".to_string()),
        instructions: Set(serde_json::json!([
            "Backofen auf 180 Grad (Umluft: 160 Grad) vorheizen. Springform (Ø 26 cm) mit Backpapier auslegen. Mehl mit Backpulver und Zucker in einer Schüssel mischen.",
            "Eier, Öl und Milch zugeben und 2 Min. schaumig schlagen. Die Hälfte des Teiges in eine andere Schüssel füllen und in der einen mit Kakao und der anderen mit Vanillinzucker verrühren.",
            "Nun 2-3 EL des hellen Teiges in die Mitte des Springformbodens geben. Direkt auf den hellen Teig mittig 2-3 EL dunklen Teig geben. Der Teig fängt dadurch an nach außen zu verlaufen. Die zwei Teige auf diese Art und Weise immer von der Mitte aus verbrauchen bis der Springformboden komplett bedeckt ist.",
            "Im Backofen ca. 40 Min. backen. Nach dem Backen auf einem Kuchenrost erkalten lassen.",
            "Zebrakuchen aus der Form lösen und auf eine Kuchenplatte setzen. Puderzucker mit Zitronensaft verrühren und den Kuchen dünn damit bestreichen, sodass von oben noch die Marmorierung zu sehen ist. Nach Belieben bunt garnieren."
        ])),
    };
    recipe.insert(&txn).await?;

    let ingredients_data = [
        (2, 300.0, "g"),        // Mehl
        (14, 1.0, "Päckchen"),  // Backpulver
        (3, 200.0, "g"),        // Zucker
        (0, 4.0, "Stück"),      // Eier
        (11, 250.0, "ml"),      // Öl
        (1, 100.0, "ml"),       // Milch
        (27, 2.0, "El"),        // Kakaopulver
        (20, 1.0, "Päckchen"),  // Vanillinzucker
        (21, 100.0, "g"),       // Puderzucker
        (22, 2.0, "El"),        // Zitronensaft
    ];

    for (idx, amount, measurement) in ingredients_data {
        let ri = recipe_ingredient::ActiveModel {
            id: Set(Uuid::now_v7()),
            recipe_id: Set(recipe_id),
            ingredient_id: Set(ingredient_ids[idx]),
            amount: Set(amount),
            measurement: Set(measurement.to_string()),
        };
        ri.insert(&txn).await?;
    }

    let rt = recipe_tag::ActiveModel {
        recipe_id: Set(recipe_id),
        tag_id: Set(tag_ids[0]), // Easy
    };
    rt.insert(&txn).await?;

    txn.commit().await?;
    Ok(())
}

async fn seed_crepe(
    db: &DatabaseConnection,
    tag_ids: &[Uuid],
    ingredient_ids: &[Uuid]
) -> Result<(), AppError> {
    let txn = db.begin().await?;
    let recipe_id = Uuid::parse_str("1a1baf5e-7b4b-11ec-90d6-0242ac120001").unwrap();

    let recipe = recipe::ActiveModel {
        id: Set(recipe_id),
        name: Set("Crêpe".to_string()),
        instructions: Set(serde_json::json!([
            "Mehl mit Zucker und Salz vermischen. Eier und Milch hinzufügen und mit einem Schneebesen oder dem Handrührgerät zu einem glatten Teig verrühren.",
            "Eine Pfanne auf mittlere Stufe erhitzen. Butter in die Pfanne geben und flüssig werden lassen.",
            "Eine Kelle des Teigs in die Pfanne gießen und durch schwenken der Pfanne verteilen.",
            "Nach ein paar Minuten den nun festeren Teig wenden. Die obere Seite sollte nun leicht braun angebacken sein. Wenn nicht braucht diese Seite noch ein paar Minuten.",
            "Wenn beide Seiten leicht braun angebacken sind den Crepe von der Pfanne nehmen. Nun mit Aufstrich der Wahl bedecken. Empfehlungen sind: Zucker, Nutella, Marmelade, Erdnussbutter."
        ])),
    };
    recipe.insert(&txn).await?;

    let ingredients_data = [
        (0, 2.0, "Stück"),  // Eier
        (1, 250.0, "ml"),   // Milch
        (2, 160.0, "g"),    // Mehl
        (3, 1.0, "Prise"),  // Zucker
        (4, 1.0, "Prise"),  // Salz
        (5, 1.0, "El"),     // Butter
    ];

    for (idx, amount, measurement) in ingredients_data {
        let ri = recipe_ingredient::ActiveModel {
            id: Set(Uuid::now_v7()),
            recipe_id: Set(recipe_id),
            ingredient_id: Set(ingredient_ids[idx]),
            amount: Set(amount),
            measurement: Set(measurement.to_string()),
        };
        ri.insert(&txn).await?;
    }

    let rt = recipe_tag::ActiveModel {
        recipe_id: Set(recipe_id),
        tag_id: Set(tag_ids[1]), // Quick
    };
    rt.insert(&txn).await?;

    txn.commit().await?;
    Ok(())
}

async fn seed_fried_chicken(
    db: &DatabaseConnection,
    _tag_ids: &[Uuid],
    ingredient_ids: &[Uuid]
) -> Result<(), AppError> {
    let txn = db.begin().await?;
    let recipe_id = Uuid::parse_str("2a2baf5e-7b4b-11ec-90d6-0242ac120002").unwrap();

    let recipe = recipe::ActiveModel {
        id: Set(recipe_id),
        name: Set("Frittiertes Hühnchen mit Reis".to_string()),
        instructions: Set(serde_json::json!([
            "Hühnchenfilet in mundgerechte Stücke schneiden. 3 Knoblauchzehen in Stücke schneiden. Nun die Hühnchenstücke und den Knoblauch in eine Schale geben. Sojasauce, Salz & Pfeffer dazugeben und mit der Hand durchmischen. Nun 20 min einziehen lassen.",
            "In einer anderen Schale Stärke & Mehl in gleichen Mengen zusammen mischen. Die Hühnerstückchen nun in das Mehl-Stärke Gemisch eingeben und bedecken. Eine Pfanne mit Öl erhitzen und die Stückchen frittieren.",
            "Nach Wunsch kann man die frittierten Stückchen nochmal frittieren. Den Reis aufsetzen damit er rechtzeitig fertig wird. Eine Soße wird gemischt aus Essig, Ketchup, Honig & Sojasauce. Abschmecken und bei Bedarf anpassen. Die Soße in einer Pfanne leicht erhitzen. Nun die frittierten Hühnchenstücke in die Soße geben sodass diese die Soße aufnehmen. Im Anschluss kann das Gericht serviert werden."
        ])),
    };
    recipe.insert(&txn).await?;

    let ingredients_data = [
        (6, 500.0, "g"),     // Hühnchenfilet
        (2, 100.0, "g"),     // Mehl
        (7, 100.0, "g"),     // Stärke
        (8, 50.0, "ml"),     // Sojasauce
        (9, 3.0, "Stück"),   // Knoblauch (Zehen)
        (3, 1.0, "Prise"),   // Zucker
        (10, 1.0, "Prise"),  // Pfeffer
        (11, 500.0, "ml"),   // Öl
        (12, 200.0, "g"),    // Reis
    ];

    for (idx, amount, measurement) in ingredients_data {
        let ri = recipe_ingredient::ActiveModel {
            id: Set(Uuid::now_v7()),
            recipe_id: Set(recipe_id),
            ingredient_id: Set(ingredient_ids[idx]),
            amount: Set(amount),
            measurement: Set(measurement.to_string()),
        };
        ri.insert(&txn).await?;
    }

    txn.commit().await?;
    Ok(())
}

async fn seed_schnitzel(
    db: &DatabaseConnection,
    _tag_ids: &[Uuid],
    ingredient_ids: &[Uuid]
) -> Result<(), AppError> {
    let txn = db.begin().await?;
    let recipe_id = Uuid::parse_str("3a3baf5e-7b4b-11ec-90d6-0242ac120003").unwrap();

    let recipe = recipe::ActiveModel {
        id: Set(recipe_id),
        name: Set("Schnitzel mit gedünstetem Blumenkohl/Brokkoli und Kartoffelpüree".to_string()),
        instructions: Set(serde_json::json!([
            "Kartoffeln schälen und klein schneiden. Anschließend in einen Topf kochendes Wasser geben zusammen mit einer guten Prise Salz. Das Ganze 20 min köcheln lassen. Währenddessen den Stamm vom Blumenkohl/Brokkoli abschneiden und die einzelnen Spitzen in einem Dünstaufsatz über einen Topf mit kochendem Wasser stellen.",
            "Filets auslegen und mit Salz und Paprikagewürz einreiben (Schweinefilets vorher noch klopfen, damit sie zarter werden). Die zwei Eier in einem Teller aufschlagen und verrühren. Auf einen anderen Teller Paniermehl streuen. Nun die Filets erst in das Ei einlegen, anschließend im Paniermehl bedecken.",
            "Die Schnitzel dann in einer Pfanne bei mittlerer Temperatur mit Öl anbraten bis sie knusprig sind. Wenn der Blumenkohl/Brokkoli noch leichten Biss hat, vom Herd nehmen. Das Wasser der Kartoffeln abgießen und die Kartoffeln dann stampfen. Dann erst ein bisschen Butter und später einen Schuss Milch unter weiteren Stampfen hinzugeben."
        ])),
    };
    recipe.insert(&txn).await?;

    let ingredients_data = [
        (15, 5.0, "Stück"),  // Kartoffeln
        (0, 2.0, "Stück"),   // Eier
        (16, 100.0, "g"),    // Paniermehl
        (5, 50.0, "g"),      // Butter
        (1, 100.0, "ml"),    // Milch
        (11, 200.0, "ml"),   // Öl
    ];

    for (idx, amount, measurement) in ingredients_data {
        let ri = recipe_ingredient::ActiveModel {
            id: Set(Uuid::now_v7()),
            recipe_id: Set(recipe_id),
            ingredient_id: Set(ingredient_ids[idx]),
            amount: Set(amount),
            measurement: Set(measurement.to_string()),
        };
        ri.insert(&txn).await?;
    }

    txn.commit().await?;
    Ok(())
}

async fn seed_omelette(
    db: &DatabaseConnection,
    _tag_ids: &[Uuid],
    ingredient_ids: &[Uuid]
) -> Result<(), AppError> {
    let txn = db.begin().await?;
    let recipe_id = Uuid::parse_str("4a4baf5e-7b4b-11ec-90d6-0242ac120004").unwrap();

    let recipe = recipe::ActiveModel {
        id: Set(recipe_id),
        name: Set("Omelette".to_string()),
        instructions: Set(serde_json::json!([
            "Eier aufbrechen und in einer Schale verrühren. Dazu einen Schuss Milch geben. Mit Salz und Pfeffer würzen.",
            "Eine Pfanne mit ein bisschen Öl auf mittlere Temperatur bringen. Eier hineingeben. Falls man Käse oder ähnliches im Omelett haben möchte, nun dazugeben.",
            "Das Ganze für ca. 5 Minuten kochen. Danach umdrehen und nochmal von der anderen Seite kochen. ODER: Kochen mit Deckel auf der Pfanne. So wird die Oberseite etwas fester. Nach 10 min das Omelett in der Hälfte einklappen."
        ])),
    };
    recipe.insert(&txn).await?;

    let ingredients_data = [
        (0, 4.0, "Stück"),   // Eier
        (1, 50.0, "ml"),     // Milch
        (4, 1.0, "Prise"),   // Salz
        (10, 1.0, "Prise"),  // Pfeffer
        (11, 20.0, "ml"),    // Öl
    ];

    for (idx, amount, measurement) in ingredients_data {
        let ri = recipe_ingredient::ActiveModel {
            id: Set(Uuid::now_v7()),
            recipe_id: Set(recipe_id),
            ingredient_id: Set(ingredient_ids[idx]),
            amount: Set(amount),
            measurement: Set(measurement.to_string()),
        };
        ri.insert(&txn).await?;
    }

    txn.commit().await?;
    Ok(())
}

async fn seed_tiramisu(
    db: &DatabaseConnection,
    tag_ids: &[Uuid],
    ingredient_ids: &[Uuid]
) -> Result<(), AppError> {
    let txn = db.begin().await?;
    let recipe_id = Uuid::parse_str("5a5baf5e-7b4b-11ec-90d6-0242ac120005").unwrap();

    let recipe = recipe::ActiveModel {
        id: Set(recipe_id),
        name: Set("Tiramisu".to_string()),
        instructions: Set(serde_json::json!([
            "Eier trennen, Eigelb und Zucker in einer Rührschüssel schaumig schlagen, bis die Masse ganz hellgelb und dick wird. Das Eiweiß zu Schnee schlagen.",
            "Mascarpone löffelweise in die Eigelbmasse geben und zu einer homogenen Masse verrühren. Zum Schluss den Eischnee unterziehen.",
            "Den Espresso mit dem Amaretto mischen, in einen tiefen Teller geben und die Hälfte des Bisquits kurz eintauchen. Den Boden einer flachen Glasform damit auslegen. Die Hälfte der Mascarponecreme darüber geben.",
            "Restliche Bisquits in die Flüssigkeit tauchen und einschichten. Die übrige Creme darüber geben und die Oberfläche glatt streichen.",
            "Tiramisu zugedeckt ca. 2 Std. im Kühlschrank kalt stellen. Vor dem Servieren dick mit Kakaopulver bestäuben."
        ])),
    };
    recipe.insert(&txn).await?;

    let ingredients_data = [
        (0, 3.0, "Stück"),  // Eier
        (3, 4.0, "El"),     // Zucker
        (23, 250.0, "g"),   // Mascarpone
        (24, 250.0, "ml"),  // Espresso
        (25, 6.0, "El"),    // Amaretto
        (26, 200.0, "g"),   // Löffelbisquit
        (27, 1.0, "El"),    // Kakaopulver
    ];

    for (idx, amount, measurement) in ingredients_data {
        let ri = recipe_ingredient::ActiveModel {
            id: Set(Uuid::now_v7()),
            recipe_id: Set(recipe_id),
            ingredient_id: Set(ingredient_ids[idx]),
            amount: Set(amount),
            measurement: Set(measurement.to_string()),
        };
        ri.insert(&txn).await?;
    }

    // Tags: Desserts (7), Popular (3), Vegetarian (6)
    for tag_idx in [7, 3, 6] {
        let rt = recipe_tag::ActiveModel {
            recipe_id: Set(recipe_id),
            tag_id: Set(tag_ids[tag_idx]),
        };
        rt.insert(&txn).await?;
    }

    txn.commit().await?;
    Ok(())
}

async fn seed_lachs_auflauf(
    db: &DatabaseConnection,
    _tag_ids: &[Uuid],
    ingredient_ids: &[Uuid]
) -> Result<(), AppError> {
    let txn = db.begin().await?;
    let recipe_id = Uuid::parse_str("6a6baf5e-7b4b-11ec-90d6-0242ac120006").unwrap();

    let recipe = recipe::ActiveModel {
        id: Set(recipe_id),
        name: Set("Nudel-Lachs-Auflauf".to_string()),
        instructions: Set(serde_json::json!([
            "Den Ofen auf 200°C vorheizen. Nudeln in Wasser nach Anleitung kochen. Lachs leicht in einer Pfanne anbraten und gleichzeitig den Spinat auftauen lassen. Dabei Sahne mit dem zerrupften Mozzarella anheizen bis der Käse schmilzt. Mit Salz, Pfeffer und Curry würzen.",
            "Im Anschluss die Nudeln mit Lachs und Spinat vermischen und in eine Auflaufform füllen. Sahne-Soße übergießen und mit dem geriebenen Käse bedecken. Für ca. 30 min in den Ofen schieben.",
            "Nach 30 min aus dem Ofen holen und auf Tellern servieren."
        ])),
    };
    recipe.insert(&txn).await?;

    let ingredients_data = [
        (28, 250.0, "g"),   // Nudeln
        (29, 200.0, "g"),   // Lachs
        (30, 150.0, "g"),   // Spinat
        (31, 200.0, "ml"),  // Sahne
        (32, 150.0, "g"),   // Mozzarella
        (18, 100.0, "g"),   // Geriebener Käse
    ];

    for (idx, amount, measurement) in ingredients_data {
        let ri = recipe_ingredient::ActiveModel {
            id: Set(Uuid::now_v7()),
            recipe_id: Set(recipe_id),
            ingredient_id: Set(ingredient_ids[idx]),
            amount: Set(amount),
            measurement: Set(measurement.to_string()),
        };
        ri.insert(&txn).await?;
    }

    txn.commit().await?;
    Ok(())
}