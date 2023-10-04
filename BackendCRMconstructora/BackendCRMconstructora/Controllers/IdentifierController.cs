using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendCRMconstructora.Contexts;
using BackendCRMconstructora.Models;

namespace BackendCRMconstructora.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentifierController : ControllerBase
    {
        private readonly ConstructoraContext _context;

        public IdentifierController(ConstructoraContext context)
        {
            _context = context;
        }

        // GET: api/Identifiers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Identifier>>> GetIdentifier()
        {
            if (_context.Identifiers == null)
            {
                return NotFound();
            }
            return await _context.Identifiers.ToListAsync();
        }

        // GET: api/Identifiers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Identifier>> GetIdentifier(int id)
        {
            if (_context.Identifiers == null)
            {
                return NotFound();
            }
            var Identifiers = await _context.Identifiers.FindAsync(id);

            if (Identifiers == null)
            {
                return NotFound();
            }

            return Identifiers;
        }

        // PUT: api/Identifiers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentifier(int id, Identifier Identifiers)
        {
            if (id != Identifiers.IdentifierId)
            {
                return BadRequest();
            }

            _context.Entry(Identifiers).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentifierExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Identifiers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Identifier>> PostIdentifier(Identifier Identifiers)
        {
            if (_context.Identifiers == null)
            {
                return Problem("Entity set 'ConnectionSQLServer.Identifiers'  is null.");
            }
            _context.Identifiers.Add(Identifiers);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIdentifier", new { id = Identifiers.IdentifierId }, Identifiers);
        }

        // DELETE: api/Identifiers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIdentifier(int id)
        {
            if (_context.Identifiers == null)
            {
                return NotFound();
            }
            var Identifiers = await _context.Identifiers.FindAsync(id);
            if (Identifiers == null)
            {
                return NotFound();
            }

            _context.Identifiers.Remove(Identifiers);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IdentifierExists(int id)
        {
            return (_context.Identifiers?.Any(e => e.IdentifierId == id)).GetValueOrDefault();
        }
    }
}
