using System;
using System.Collections.Generic;
using System.Text;
using FirebirdSql.Data.FirebirdClient;

namespace FirebirdEx
{
    class FireBirdTools
    {
        public void testc()
        {
			var connectionString = new FbConnectionStringBuilder
			{
				Database = @"C:\Users\unkyulee\Documents\Danea Easyfatt\Arredo Ufficio (esempio 1).eft",
				ServerType = FbServerType.Embedded,
				UserID = "SYSDBA",
				Password = "masterkey",
				ClientLibrary = @"C:\Program Files (x86)\Danea Easyfatt\FirebirdEmbedded\fbembed.dll"
			}.ToString();
			using (var connection = new FbConnection(connectionString))
			{
				connection.Open();
				using (var transaction = connection.BeginTransaction())
				{
					using (var command = new FbCommand(
@"
SELECT 
	""IDArticolo""
	, ""CodArticolo""
	, ""Desc""
	, ""Tipologia""
	, ""NomeCategoria""
	, ""NomeCategoria_Sott""
	, ""NomeSottocategoria""
	, ""CodIva""
	, ""Udm""	
	, ""CodBarre""
	, ""NumAltriCodBarre""
	, ""IDFornitore""
	, ""CodArticoloForn""
	, ""PrezzoNettoForn""
	, ""PrezzoIvatoForn""
	, ""NoteForn""
	, ""NumAltriForn""
	, ""Url""
	, ""Produttore""
	, ""UdmDim""
	, ""DimNettaX""
	, ""DimNettaY""
	, ""DimNettaZ""
	, ""DimImballoX""
	, ""DimImballoY""
	, ""DimImballoZ""
	, ""UdmPeso""
	, ""PesoNetto""
	, ""PesoLordo""
	, ""GestMagazzino""
	, ""NumComponenti""
	, ""NextLottoProdotto""
	, ""GgOrdine""
	, ""OrdinaAMultipliDi""
	, ""QtaGiacenza_Import""
	, ""PrezzoMedioCarico""
	, ""PrezzoMedioScarico""
	, ""PrezzoUltimoCarico""
	, ""Extra1""
	, ""Extra2""
	, ""Extra3""
	, ""Extra4""
	, ""Note""
	, ""PubblicaSuWeb""
	, ""PubblicaSuWeb2""
	, ""PubblicaSuWeb3""
	, ""DescHtml""
	, ""Taglie""
	, ""Tmp_Colori""
	, ""PathImmagine_Import""
	, ""MostraInTouch""
FROM ""TArticoli""
",
						connection,
						transaction))
					{
						using (var reader = command.ExecuteReader())
						{
							while (reader.Read())
							{
								var values = new object[reader.FieldCount];
								reader.GetValues(values);
								Console.WriteLine(string.Join("|", values));
							}
						}
					}
				}
			}
		}
    }
}
